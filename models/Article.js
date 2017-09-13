var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ArticleSchema = new Schema({

    title: {
        type: String,
        require: true
    },

    article: {
        type: String,
        require:true
    },

    link: {
        type: String,
        require: true
    },
    image: {
        type: String
    },

    note: {
        type: Schema.Types.ObjectId,
        ref: 'note'
    }

});

var Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
