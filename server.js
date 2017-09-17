
// dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// var mongojs = require("mongojs");
var logger = require('morgan');
var PORT = process.env.PORT || 8080;
var request = require('request');
var cheerio = require('cheerio');
var path = require('path');
var exphbs = require('express-handlebars');
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static(process.cwd() + '/public'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

// make public a static dir
app.use(express.static('public'));


// var databaseUrl = "news";
// var collections = ["articleData"];
// Hook mongojs configuration to the db variable
// var db = mongojs(databaseUrl, collections);

// Database configuration with mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://heroku_qmdkjhkk:gf8u5k3ekn91l6m1etmtrjh32e@ds133084.mlab.com:33084/heroku_qmdkjhkk');
//heroku: //mongodb://heroku_qmdkjhkk:gf8u5k3ekn91l6m1etmtrjh32e@ds133084.mlab.com:33084/heroku_qmdkjhkk
//mongodb://localhost/news
var db = mongoose.connection;

mongoose.model('users',{name: String});

// show any mongoose errors
db.on('error', function (err) {
  console.log('Mongoose Error: ', err);
});

// once logged in to the db through mongoose, log a success message
db.once('open', function () {
  console.log('Mongoose connection successful.');
});
// route
// =====
var Comment = require('./models/Comment');
var Article = require('./models/Article');
var todaysPaper = "http://www.nytimes.com/pages/todayspaper/index.html?action=Click&module=HPMiniNav&region=TopBar&WT.nav=page&contentCollection=TodaysPaper&pgtype=Homepage";



app.get("/", function (req, res) {

  var articles = Article.find({}, function (err, doc) {

    console.log(doc);
    res.render('index', {
      doc: doc
    });

  })
});

app.get('/scrape', function (err, res) {
  request("http://www.nytimes.com/pages/todayspaper/index.html?action=Click&module=HPMiniNav&region=TopBar&WT.nav=page&contentCollection=TodaysPaper&pgtype=Homepage",
  function (error, response, html) {

    var $ = cheerio.load(html);

    $('.story').each(function (i, element) {

      var result = {};

      result.title = $(this).children('h3').text();
      result.article = $(this).find('p').text();
      result.text = $(this).children('p').text();
      result.link = $(this).find('a').attr('href');
      result.image = $(this).find('img').attr('src');


          var entry = new Article(result);

          entry.save(function (err, doc) {
          if (err) {
            console.log(err);

        }
     // Or log the doc
          else {

            console.log(doc);

        }
      });
    });
    res.redirect("/");
  });


  // Article.find({}, function (err, doc) {
  //   // log any errors
  //   if (err) {
  //     console.log(err);
  //   }
  //   // once scrape button is pressed, redirect to main page
  //   else {
  //     res.redirect("/");
  //   }
  // });
});

app.get('/api', function (req, res) {
  // grab every doc in the Articles array
  Article.find({}).populate('comments').exec(function (err, doc) {


    // log any errors
    if (err) {
      console.log(err);
    }
    // or send the doc to the browser as a json object
    else {

      res.json(doc);

    }
  });
});

app.get('/delete', function (req, res) {
  // grab every doc in the Articles array
  Article.remove({}, function (err, doc) {
    // log any errors
    if (err) {
      console.log(err);
    }
    // once delete button is pressed, redirect to main page
    else {
      res.redirect("/");
    }
  });
});

app.get('/', function (req, res){

  // Query MongoDB for all article entries (sort newest to top, assuming Ids increment)
  Article.find().sort({_id: -1})

    // But also populate all of the comments associated with the articles.
    .populate('comments')

    // Then, send them to the handlebars template to be rendered
    .exec(function(err, doc){
      // log any errors
      if (err){
        console.log(err);
      }
      // or send the doc to the browser as a json object
      else {
        var hbsObject = {articles: doc}
        res.render('index', hbsObject);
        res.redirect("/");
        // res.json(hbsObject)
      }
    });

});

// Add a Comment Route - **API**
app.post('/add/comment/:id', function (req, res){

  // Collect article id
  var articleId = req.params.id;

  // Collect Author Name
  var commentAuthor = req.body.name;

  var test = req.body
  console.log(test)
  // Collect Comment Content
  var commentContent = req.body.comment;
  console.log(commentContent);
  // "result" object has the exact same key-value pairs of the "Comment" model
  var result = {
    author: commentAuthor,
    content: commentContent
  };

  // Using the Comment model, create a new comment entry
  var entry = new Comment (result);

  // Save the entry to the database
  entry.save(function(err, doc) {
    // log any errors
    if (err) {
      console.log(err);
    }
    // Or, relate the comment to the article
    else {
      // Push the new Comment to the list of comments in the article
      Article.findOneAndUpdate({'_id': articleId}, {$push: {'comments':doc._id}}, {new: true})
      // execute the above query
      .exec(function(err, doc){
        // log any errors
        if (err){
          console.log(err);
        } else {
          // Send Success Header
          // res.sendStatus(200);
          res.redirect("/");
        }
      });
    }
  });

});

// Delete a Comment Route
app.post('/remove/comment/:id', function (req, res){

  // Collect comment id
  var commentId = req.params.id;

  // Find and Delete the Comment using the Id
  Comment.findByIdAndRemove(commentId, function (err, todo) {

    if (err) {
      console.log(err);
    }
    else {
      // Send Success Header
      res.sendStatus(200);
    }

  });
    res.redirect("/");
});


app.listen(PORT, function () {
  console.log('IM LISTENING IS PORT ' + PORT);
})
