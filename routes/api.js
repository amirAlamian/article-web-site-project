const express =require("express");
const User = require("../models/blogger");
const router = express.Router();



router.get("/signUp" , (req, res)=>{
    res.render("pages/signUp")
})
router.post("/", (req, res) => {
//     console.log("Dsfd");
//    const newUser= new User({
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     userName: req.body.userName,
//     password: req.body.password,
//     gender: req.body.gender,
//     phoneNumber: req.body.phoneNumber,
//     role:"admin"
//    })
//    newUser.save((err,data)=>{
//        if(err) console.log(err);
//        else{
//            return res.json(data)
//        }
//    })
    
})

module.exports = router;