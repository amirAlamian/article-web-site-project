const express = require('express');
const router = express.Router();
const { renderSync } = require('node-sass');
const Article = require("../models/article");
const articleRouter = require("./article");
const multer = require('multer');
const User = require("../models/blogger");
const fs=require("fs")





router.use("/article", articleRouter)
///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// get dashboard end points /////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////


router.get("/", (req, res) => {
    (async () => {//promise to find article and send for adding passage
        try {
            let article = await new Promise((resolve, reject) => {

                Article.find({ author: req.session.user.userName }, (err, data) => {

                    if (err) reject(err);

                    resolve(data);
                })
            })

            return res.render("pages/dashboard", {
                user: req.session.user,
                theme: req.cookies.theme,
                articles: article
            })
        } catch (error) {
            console.log(error.message);
            res.send("something went wrong")
        }
    })();


})

///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////// multer package usage and apload avatar end point //////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        let fileType=file.originalname.split(".");// this is file type name
        cb(null, new Buffer.from(req.session.user.userName).toString('base64') + ".png")
    }
})

const uploadAvatar = multer({ storage: storage });


router.post('/uploadAvatar', (req, res) => {
    const upload = uploadAvatar.single('avatar');

    upload(req, res, function (err) {
        if (err) return res.status(400).send('something went wrong.please try again later');

        User.findByIdAndUpdate(req.session.user._id, { avatar: req.file.filename }, { new: true }, (err, user) => {

            if (err) return res.status(400).send('something went wrong.please try again later');

            req.session.user.avatar = req.file.filename;
            res.send(user)
        })


    })
})

module.exports = router;
