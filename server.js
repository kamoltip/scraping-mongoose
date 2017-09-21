
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
require ("./routes")(app);
// Database configuration with mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://heroku_qmdkjhkk:gf8u5k3ekn91l6m1etmtrjh32e@ds133084.mlab.com:33084/heroku_qmdkjhkk');
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

app.listen(PORT, function () {
  console.log('IM LISTENING TO PORT ' + PORT);
})
