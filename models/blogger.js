const mongoose=require("mongoose")
const Schema = mongoose.Schema;

const UserSchema= new Schema ({
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
        maxlength: 36,
        minlength: 8,
    },
    email:{
        type:String,
        require:true,
        trim:true,
        unique:true
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
UserSchema.pre("save",function(){
    if(this.gender==="male"){
        this.avatar="male.jpg"
    }
    if(this.gender==="female"){
        this.avatar="female.jpg"
    }
    next();
})

module.exports = mongoose.model('User', UserSchema);