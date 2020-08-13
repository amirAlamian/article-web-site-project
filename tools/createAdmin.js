const bcrypt = require('bcrypt');
const saltRounds = 15;
const User = require("../models/blogger");


async function createAdmin(){
    try {

    let admin=await User.findOne({role:"admin"})

    if(!admin){
        const createAdmin = new User({
            firstName:"amir",
            lastName:"alamian",
            userName:"amirAlamian",
            password: await bcrypt.hash(process.env.ADMIN_PASS, saltRounds),
            gender:"male",
            role:"admin",
            email:"amiralamian10@gmail.com",
            phoneNumber:"09214698677"
        })
        admin = await createAdmin.save();
        if(admin){
            console.log("admin created");
        }
    }
    else{
        console.log("admin already created");
    }
  
      
  } catch (error) {
      console.log(error);
  }
}

module.exports = createAdmin;