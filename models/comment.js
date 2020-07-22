const mongoose=require("mongoose")
const Schema = mongoose.Schema;

const CommentSchema= new Schema ({
    text:{
        type:String,
        require:true,
        trim:true
    },
    article:{
        type:String,
        require:true
    },
    sender:{
        type:String,
        require:true
    },
    sentAt: {
        type: Date,
        required: true,
        default: Date.now
    }


},{
    collation:"comment"
})



module.exports = mongoose.model('Comment', CommentSchema);