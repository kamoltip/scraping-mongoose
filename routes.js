var request = require('request');
var cheerio = require('cheerio');

var Comment = require('./models/Comment');
var Article = require('./models/Article');
var todaysPaper = "http://www.nytimes.com/pages/todayspaper/index.html?action=Click&module=HPMiniNav&region=TopBar&WT.nav=page&contentCollection=TodaysPaper&pgtype=Homepage";



module.exports = function(app){

app.get("/", function (req, res) {

Article.find({})
.populate('comments')
.exec(function(err, doc){

  if (err){
    console.log(err);
  }
  else{
    console.log('doc:---------->', doc);
    res.render('index', {doc: doc})
}
});
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
          else {

            console.log(doc);

        }
      });
    });
    res.redirect("/");
  });
});

app.get('/api', function (req, res) {
  // grab every doc in the Articles array
  Article.find({})
  .populate('comments')
  .exec(function (err, doc) {

    if (err) {
      console.log(err);
    }

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

// Add a Comment Route - **API**
app.post('/add/comment/:id', function (req, res){

  // Collect article id
  var articleId = req.params.id;

  // Collect Author Name
  var commentAuthor = req.body.name;

  // Collect Comment Content
  var commentContent = req.body.comment;
  console.log("commentContent:=============",commentContent);
  // "result" object has the exact same key-value pairs of the "Comment" model
  var result = {
    author: commentAuthor,
    content: commentContent
  };

  // Using the Comment model, create a new comment entry
  var entry = new Comment (result);
  console.log('entry==========================', entry);
  // Save the entry to the database
  entry.save(function(err, doc) {
    // log any errors
    if (err) {
      console.log(err);
    }
    // Or, relate the comment to the article
    else { 
      console.log('doc==========================:', doc);
      // Push the new Comment to the list of comments in the article
      Article.findOneAndUpdate({'_id': articleId}, {$push: {'comments':entry}}, {new: true})
      // execute the above query
      .exec(function(err, doc){
        // log any errors
        if (err){
          console.log(err);
        } else {
          console.log('inside the else');
          // Send Success Header
          // res.sendStatus(200);
          res.redirect("/");
        }
      });
    }
  });

});

// Delete a Comment Route
app.get('/remove/comment/:id', function (req, res){


  // Collect Author Name
  // var commentAuthor = req.body.name;

  // // Collect Comment Content
  // var commentContent = req.body.comment;
  // Article.findByIdAndRemove({'_id': commentAuthor}), {$pull: {'comments':_id}}
  //   .exec(function(err, doc){

  //       if (err){
  //         console.log(err);
  //       } else {
  //         console.log('deleted');
  //         // Send Success Header
  //         // res.sendStatus(200);
          
  //       }
        
  //   });
    res.redirect("/");
});

};
   