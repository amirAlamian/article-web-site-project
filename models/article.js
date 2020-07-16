const mongoose=require("mongoose")
const Schema = mongoose.Schema;

const ArticleSchema= new Schema ({
    title:{
        type:String,
        require:true,
        trim:true,
        minlength:3,
    },
    body:{
        type:String,
        require:true,
        default:"new article has been made"
    },
    picture:{
        type:String
    },
    author:{
        type:String,
        require:true
    },
    view:{
        type:String,
        default:0
    },
    description:{
        type:String,
        require:true
    },
    published:{
        type:Boolean,
        default:false
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },


},{
    collation:"article"
})



module.exports = mongoose.model('Article', ArticleSchema);