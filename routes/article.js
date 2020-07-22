const express = require('express');
const router = express.Router();
const { renderSync } = require('node-sass');
const Article = require("../models/article");
const Comment = require("../models/comment")
const Response= require("../tools/response")
const Functions = require("../tools/functions");

///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// get all user articles end points /////////////////////////
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
            if (!article) {
                throw new Error("something went wrong. please try again later")
            }
            res.status(201).json(new Response(true, article, Date.now))
        } catch (error) {
            console.log(error.message);
            res.json(new Response(true, "something went wrong. please try again later", Date.now))
        }
    })();
})

///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// get all articles end points /////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
router.get("/getAll", (req, res) => {

    (async () => {//promise to find article and send for adding passage
        try {
            let article = await new Promise((resolve, reject) => {

                Article.find({}, (err, data) => {

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
///////////////////////////// add title and description end points ///////////////////////////
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
//////////////////////////////////////// add get end points //////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

router.get("/add/:article_id", (req, res) => {

    findArticle(req, res, "pages/addArticle", false)

})

///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// add post end points /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

router.post("/add/:article_id", async (req, res) => {
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
//////////////////////////////////////// read end points /////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

router.get("/read/:article_id", (req, res) => {

    Functions.findArticle(req, res, "pages/readArticle", true)

})

///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// edit end points /////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

router.get("/edit/:article_id", (req, res) => {

    Functions.findArticle(req, res, "pages/addArticle", false);

})

///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// remove end points /////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

router.post("/remove/:article_id", (req, res) => {

    Functions.removeArticle(req, res);

})

///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// get all article page end point //////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

router.get("/allArticles/:published", (req, res) => {
    if (req.params.published === "published") {
        res.render("pages/allArticle.ejs", { published: true })

    }
    else {

        res.render("pages/allArticle.ejs", { published: false })

    }


})

///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// send to admin  end point //////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

router.post("/sendToAdmin/:publishStatus", (req, res) => {
    
    Article.findByIdAndUpdate(req.params.publishStatus, { sendToAdmin: true }, { new: true }, (err, data) => {
        if (data) {
            console.log(data);
            return res.status(200).json(new Response(true, "article has been successfully sent to admin", Date.now))
        }
        else {
            return res.status(400).json(new Response(false, "something went wrong. please rty again later", Date.now))
        }
    })


})

///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// send comment  end point ///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

router.post("/sendComment/:article_id", async (req, res) => {
    try {

        console.log(req.body);
        console.log(req.session.user.userName);
        console.log(req.params.article_id);
        let newComment = new Comment({
            text: req.body.comment,
            sender: req.session.user.userName,
            article: req.params.article_id
        })
        let comment = await newComment.save()
        if (!comment) {
            throw new Error("something went wrong. please try again later")
        }
        return res.status(200).json(new Response(true, comment, Date.now))
    } catch (error) {
        console.log(error.message);
        return res.status(400).json(new Response(false, error.message, Date.now))

    }

})

///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// get all article page end point //////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

router.get("/getComments/:article_id", async (req, res) => {

    try {

        let comments = await Comment.find({ article: req.params.article_id })
        if (comments) {
            res.status(201).json(new Response(true, comments, Date.now))
        }
        else {
            throw new Error("something went wrong. please try again later.")
        }

    } catch (error) {
        console.log(error.message);
        req.json(new Response(false, error.message, Date.now))

    }



})
module.exports = router;