const express = require("express");
const User = require("../models/blogger");
const router = express.Router();
const axios = require("axios");
const articleRouter= require("./article")
const userDashboard = require("./users")
const Article = require("../models/article")
const admin = require("./admin")
const Response = require("../tools/response")

///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////session check/////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

const checkSession = (req, res, next) => {
    if (!req.session.user) {
        res.redirect("/api/signIn");
    }
    next()
}

const checkAdminSession = async (req, res, next) => {
    try {
        let admin = await User.find({ role: "admin" })
        for (let i = 0, n = admin.length; i < n; i++) {

            if (!req.session.user || req.session.user._id != admin[i]._id) {
                console.log("omad");
                return res.redirect("/api/signIn");
            }

        }
    } catch (error) {
        console.log(error);
        return res.status(403).json("forbidden")
    }
    next()

}


router.use('/dashboard', checkSession, userDashboard);
router.use('/article', checkSession, articleRouter);
router.use('/admin', checkAdminSession, admin);



//check is log in before or not
const isLogin = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/api/dashboard')
    }
    next()
}


///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////setting up sign up requests///////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

router.get("/", async (req, res) => {
    try {

        let mostViewedArticles = await Article.find().sort({ "view.number": -1 })
        if (!mostViewedArticles) {
            throw new Error("something went wrong.")
        }

        let newArticles = await Article.find()
        if (!newArticles) {
            throw new Error("something went wrong.")
        }

        res.cookie("theme", "light");
        req.cookies.theme = "light";

        newArticles = newArticles.reverse();

        let top10Viwed = [];
        let top10New = [];

        for (let i = 0; i < 9; i++) {//chossing 10 articles to send 
            top10Viwed.push(mostViewedArticles[i]);
            top10New.push(newArticles[i]);
        }

        console.log(top10Viwed);
        return res.render("pages/home", {
            theme: req.cookies.theme,
            user: req.session.user,
            mostViewed: top10Viwed,
            newArticles: top10New
        })
    } catch (error) {
        console.log(error.message);
        res.json(new Response(false, error.message, Date.now))

    }

})
router.get("/dark", (req, res) => {
    res.cookie("theme", "dark");
    req.cookies.theme = "dark"
    res.render("pages/home", {
        theme: req.cookies.theme,
        user:req.session.user
    })
})

router.get("/signUp", (req, res) => {
    res.cookie("theme", "light");
    req.cookies.theme = "light"
    res.render("pages/signUp", {
        message: "welcome! please insert required information and hit the sign up button.",
        theme: req.cookies.theme,
        className: "alert alert-light"
    })
})

router.post("/signUp", async (req, res) => {
    try {
        if (!req.body.userName || !req.body.password || !req.body.firstName || !req.body.lastName || !req.body.email || !req.body.gender || !req.body.phoneNumber) {
            throw new Error('You have an empty input.')
        };
        if (req.body.password.length < 8 || req.body.password.length > 36) {
            throw new Error(`password is too short or too long`);
        };

        //recaptcha request to google 
        let recaptcha_response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=6LcS6bAZAAAAABqvkwvD4oqULb2CLnOy4qO1t_GB&response= ${req.body.recapResponse}`);
        if (recaptcha_response.data.success) {
            const newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                userName: req.body.userName,
                password: req.body.password,
                email: req.body.email,
                gender: req.body.gender,
                phoneNumber: req.body.phoneNumber,
            })
            let blogger = await newUser.save()
            return res.status(201).send("done")
        }



    } catch (error) {
        if (error.code === 11000) {//error for  existed informations 
            console.log(error.keyValue);
            return res.send(`there is another account with this ${Object.keys(error.keyValue)[0].toLowerCase()}. please use another one`)
        }
        console.log(error);
        return res.send(error.message)
    }

})

router.get("/dark/signUp", (req, res) => {//dark mode
    res.cookie("theme", "dark");
    req.cookies.theme = "dark"
    res.render("pages/signUp", {
        message: "welcome! please insert required information and hit the sign up button.",
        theme: req.cookies.theme,
        className: "alert alert-light"
    })
})


///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// setting up sign in requests ////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

router.get('/signIn', function (req, res) {
    res.cookie("theme", "light");
    req.cookies.theme = "light"
    res.render("pages/signIn", {
        message: "welcome back! please insert required information and hit the sign In button.",
        theme: req.cookies.theme,
        className: "alert alert-light"
    })
});

router.post('/signIn', function (req, res) {
    (async () => {//promise to check username and password
        try {
            if (!req.body.userName || !req.body.password) {
                throw new Error('You have an empty input.')
            };
            let user = await new Promise((resolve, reject) => {

                User.findOne({ $and: [{ userName: req.body.userName }, { password: req.body.password }] }, (err, data) => {

                    if (err) reject(err);

                    resolve(data);

                })

            })
            console.log(user);
            if (user === null) {
                res.render("pages/signIn", {
                    message: "sorry! can not find an user with this informations.",
                    theme: req.cookies.theme,
                    className: "alert alert-danger"
                })
            }
            if (user.role === "admin") {
                req.session.user = user;
                res.redirect("admin")

            }
            else if (user) {

                req.session.user = user;//issue session for signed in users

                res.redirect("dashboard")

            }


        } catch (error) {
            console.log(error);
            res.render("pages/signIn", {
                message: error.message,
                theme: req.cookies.theme,
                className: "alert alert-danger"
            })
        }


    })()
});

router.get("/dark/signIn", (req, res) => {//dark mode
    res.cookie("theme", "dark");
    req.cookies.theme = "dark"
    res.render("pages/signIn", {
        message: "welcome back! please insert required information and hit the sign In button.",
        theme: req.cookies.theme,
        className: "alert alert-light"
    })
})

///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////setting up log out requests///////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

router.get("/logOut", (req, res) => {//dark mode

    req.session.destroy();

    res.redirect("/api/signIn")
})

///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////setting up log out requests///////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
router.get('/getAuthorImage/:author_name', async function (req, res) {

    try {

        let user = await User.find({userName:req.params.author_name})
        console.log(user);
        if (!user[0]) {
            throw new Error("something went wrong.")
        }
        return res.status(201).json(new Response(true, user[0].avatar, Date.now));
    } catch (error) {
        console.log(error.message);
        res.json(new Response(false, error.message, Date.now))

    }

});

module.exports = router;