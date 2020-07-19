const express = require("express");
const Article = require("../models/article");
const router = express.Router();



router.get("/", (req, res) => {


    Article.find({}, (err, data) => {
    
    })
    res.render
})






module.exports = router;