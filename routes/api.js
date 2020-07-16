const express = require("express");
const User = require("../models/blogger");
const router = express.Router();
const axios = require("axios");
const userDashboard = require("./users")


///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////session check/////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

const checkSession = (req, res, next) => {
    if (!req.session.user) {
        res.redirect("/api/signIn");
    }
    next()
}


router.use('/dashboard', userDashboard);
router.use('/article', checkSession, userDashboard);
router.use('/comment', checkSession, userDashboard);



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

router.get("/", (req, res) => {
    res.cookie("theme", "light");
    req.cookies.theme = "light"
    res.render("pages/home", {
        theme: req.cookies.theme,
    })
})
router.get("/dark", (req, res) => {
    res.cookie("theme", "dark");
    req.cookies.theme = "dark"
    res.render("pages/home", {
        theme: req.cookies.theme,
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
////////////////////////////////////////setting up sign in requests///////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

router.get('/signIn',  function (req, res) {
    res.cookie("theme", "light");
    req.cookies.theme = "light"
    res.render("pages/signIn", {
        message: "welcome back! please insert required information and hit the sign In button.",
        theme: req.cookies.theme,
        className: "alert alert-light"
    })
});

router.post('/signIn',  function (req, res) {
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


module.exports = router;