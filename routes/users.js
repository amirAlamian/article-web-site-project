const express = require('express');
const router = express.Router();
const { renderSync } = require('node-sass');
const Article = require("../models/article");
const articleRouter=require("./article")

///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// end points ///////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

router.use("/article",articleRouter)
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

module.exports = router;
