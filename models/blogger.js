import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Userschema= new Schema ({
    firstName:{
        type:String,
        require:true,
        trim:true,
        minlength:3,
        maxlength:30
    },
    lastName:{
        type:String,
        require:true,
        trim:true,
        maxlength: 30,
        minlength: 3
    },
    userName:{
        type:String,
        require:true,
        unique:true,
        trim:true,
        maxlength: 30,
        minlength: 3,
    },
    password:{
        type:String,
        require:true,
        trim:true,
        maxlength: 30,
        minlength: 8,
    },
    gender:{
        type:String,
        require:true,
        trim:true,
        enum:["female","male"]
    },
    phoneNumber:{
        type:String,
        require:true,
        trim:true,
        unique:true
    },
    role:{
        type: String,
        enum: ['blogger', 'admin']
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    avatar: {
        type: String
    }


},{
    collation:"blogger"
})


export default mongoose.model('User', UserShema);