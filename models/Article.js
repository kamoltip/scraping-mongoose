var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ArticleSchema = new Schema({

    title: {
        type: String,
        required: true,
        unique: true
    },

    article: {
        type: String,
        required:true
    },

    link: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    comments: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      required: true
    }]
});

var Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
