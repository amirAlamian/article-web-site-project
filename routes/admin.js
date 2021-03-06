const express = require("express");
const Article = require("../models/article");
const router = express.Router();
const Response= require("../tools/response")
const Functions = require("../tools/functions");


router.get("/", (req, res) => {

    Article.find({ sendToAdmin: true }, (err, data) => {
        res.render("pages/admin.ejs", {
            articles: data.reverse(),
            lang:req.cookies.lang
        })


    })

})
///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// admin end points  ///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

router.get("/read/:article_id", (req, res) => {
    Functions.findArticle(req, res, "pages/readArticle.ejs")
})
///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// admin end points  ///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
router.get("/edit/:article_id", (req, res) => {
    console.log(req.params.article_id,"dfdsfhdsuhfu");
    Functions.findArticle(req, res, "pages/addArticle.ejs")

})
///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// admin end points  ///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
router.post("/remove/:article_id", (req, res) => {

    Functions.removeArticle(req, res)


})
///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// admin end points  ///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
router.post("/publishArticle/:article_id", (req, res) => {
    (async () => {
        try {
            let article = await new Promise((resolve, reject) => {

                Article.findByIdAndUpdate(req.params.article_id,{published:true}, (err, data) => {

                    if (err) reject(err);

                    resolve(data);
                })
            })
            if (!article) {
                throw new Error("there is no article with this informations")
            }
            return res.json( new Response(true,article,Date.now))
        } catch (error) {
            console.log(error.message);
            return res.json(new Response(false,"something went wrong",Date.now))
        }
    })()


})





module.exports = router;
