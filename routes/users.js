const express = require('express');
const router = express.Router();
const { renderSync } = require('node-sass');
const Article = require("../models/article");
const articleRouter = require("./article");
const multer = require('multer');
const User = require("../models/blogger");
const Response = require("../tools/response")
const bcrypt = require('bcrypt');
const saltRounds = 15;



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
                }).sort({ "view.number": -1 })
            })

            return res.render("pages/dashboard", {
                user: req.session.user,
                theme: req.cookies.theme,
                articles: article,
                lang: req.cookies.lang
            })
        } catch (error) {
            console.log(error.message);
            res.send("something went wrong")
        }
    })();


})
///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// get dashboard end points /////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////


router.get("/userAccount", (req, res) => {

    res.render("pages/userAccount", {
        user: req.session.user,
        theme: req.cookies.theme,
        lang: req.cookies.lang
    })



})






///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////// multer package usage and apload avatar end point //////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        let fileType = file.originalname.split(".");// this is file type name
        cb(null, new Buffer.from(req.session.user.userName).toString('base64') + ".png")
    }
})

const uploadAvatar = multer({ storage: storage });


router.post('/uploadAvatar', async (req, res) => {

    try {

        const upload = uploadAvatar.single('avatar');

        upload(req, res, async function (err) {
            if (err) return res.status(400).send('something went wrong.please try again later');

            let user = await User.findByIdAndUpdate(req.session.user._id, { avatar: req.file.filename }, { new: true })

            if (!user) throw new Error('something went wrong.please try again later');

            req.session.user.avatar = req.file.filename;
            res.status(201).send(new Response(true, "updated", Date.now));



        })

    } catch (error) {
        console.log(error.message);
        res.json(new Response(false, error.message, Date.now))
    }

})


///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// user information update end point ///////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

router.put("/updateUser", async (req, res) => {
    try {
        if (!req.body.password || !req.body.firstName || !req.body.lastName || !req.body.email || !req.body.phoneNumber) {
            throw new Error('You have an empty input.')
        };
        req.body.password = await bcrypt.hash(req.body.password, saltRounds);
        let user = await User.findByIdAndUpdate(req.session.user._id, req.body, { new: true });

        if (!user) {
            throw new Error("something went wrong. please try again later")
        }

        req.session.user = user;
        res.json(new Response(true, "your account has been updated successfully", Date.now))

    } catch (error) {
        console.log(error.message);
        res.json(new Response(false, error.message, Date.now))

    }

})


module.exports = router;
