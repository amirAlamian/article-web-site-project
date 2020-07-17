const express = require('express');
const router = express.Router();
const { renderSync } = require('node-sass');
const Article = require("../models/article");


///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// function for finding articles by id //////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

const findArticle = async (req, res,url) => {
    //promise to find article and send for adding passage
    try {
        let article = await new Promise((resolve, reject) => {

            Article.findById(req.params.article_id, (err, data) => {

                if (err) reject(err);

                resolve(data);
            })
        })
        if (!article) {
            throw new Error("there is no article with this informations")
        }
        return res.render(url, { article })
    } catch (error) {
        console.log(error.message);
        return res.render("pages/error", {
            message: "404 NOT FOUND"
        });
    }
};


///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// end points //////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
router.get("/get", (req, res) => {
    (async () => {//promise to find article and send for adding passage
        try {
            let article = await new Promise((resolve, reject) => {

                Article.find({ author: req.session.user.userName }, (err, data) => {

                    if (err) reject(err);

                    resolve(data);
                })
            })

            res.json(article)
        } catch (error) {
            console.log(error.message);
            res.send("something went wrong")
        }
    })();
})

///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// end points //////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

router.post("/add", async (req, res) => {
    try {
        if (!req.body.title || !req.body.description) {
            throw new Error("you have an empty input")
        }
        const newArticle = new Article({
            title: req.body.title,
            description: req.body.description,
            author: req.session.user.userName
        })
        let article = await newArticle.save()
        if (!article) {
            throw new Error("something went wrong")
        }
        return res.status(201).json(article);


    } catch (error) {
        console.log(error);
        return res.send(error.message)

    }
})



///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// end points //////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

router.get("/add/:article_id", (req, res) => {
   
    findArticle(req,res,"pages/addArticle")

})

///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// end points //////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

router.post("/add/:article_id", async (req, res) => {
    console.log("dfjsdfhsdjhjdsh");
    try {// prmise for adding passage to article
        console.log(req.params.article_id);
        if (!req.body.passage) {
            throw new Error("your article is empty")
        }
        let article = await Article.findByIdAndUpdate(req.params.article_id, { body: req.body.passage }, { new: true })
        console.log(article);
        if (!article) {
            throw new Error("something went wrong")
        }
        return res.status(201).json("done");


    } catch (error) {
        console.log(error.message);
        return res.send(error.message)

    }
})

///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// end points //////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

router.get("/read/:article_id", (req, res) => {
    console.log("dsfdfdsf");

    findArticle(req,res,"pages/readArticle")

})

///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// end points //////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////



module.exports = router;