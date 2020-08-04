const mongoose = require("mongoose");
const { NotExtended } = require("http-errors");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
        require: true,
        trim: true,
        minlength: 3,
    },
    body: {
        type: String,
        require: true,
        default: "new article has been made"
    },
    picture: {
        type: String
    },
    author: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    published: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    view: {
        type: Object,
        default:{number:0,viewer:[]}
    },
    sendToAdmin: {
        type: Boolean,
        default: false
    },
    image:{
        type:String,
        default:"article_picture.png"
    }

}, {
    collation: "article"
})



module.exports = mongoose.model('Article', ArticleSchema);