const express = require("express");
const User = require("../models/blogger");
const router = express.Router();
const axios = require("axios");
const articleRouter = require("./article")
const userDashboard = require("./users")
const Article = require("../models/article")
const admin = require("./admin")
const Response = require("../tools/response");
const sendEmail = require("../tools/sendEmail")
const bcrypt = require('bcrypt');
const saltRounds = 15;
const createAdmin =require("../tools/createAdmin")

///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////session check/////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

createAdmin();

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

        return res.render("pages/home", {
            theme: req.cookies.theme,
            user: req.session.user,
            mostViewed: top10Viwed,
            newArticles: top10New,
            lang: req.cookies.lang
        })
    } catch (error) {
        console.log(error.message);
        res.json(new Response(false, error.message, Date.now))

    }

})

router.get("/signUp", (req, res) => {
    res.cookie("theme", "light");
    req.cookies.theme = "light"
    res.render("pages/signUp", {
        message: (req.cookies.lang === "EN") ? "welcome! please insert required information and hit the sign up button." : "خوش آمدید! لطفا اطلاعات خواسته شده را وارد کنید و سپس دکمه ثبت نام را بزنید",
        theme: req.cookies.theme,
        className: "alert alert-light",
        lang: req.cookies.lang
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
            req.body.password = await bcrypt.hash(req.body.password, saltRounds);
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



///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// setting up sign in requests ////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

router.get('/signIn', function (req, res) {
    res.cookie("theme", "light");
    req.cookies.theme = "light"
    res.render("pages/signIn", {
        message: (req.cookies.lang === "EN") ? "welcome back! please insert required information and hit the sign In button." : "خوش آمدید! لطفا اطلاعات مورد نیاز را وارد کنید و سپس دکمه ورود را بزنید",
        theme: req.cookies.theme,
        className: "alert alert-light",
        lang: req.cookies.lang
    })
});

router.post('/signIn', function (req, res) {
    (async () => {//promise to check username and password
        try {
            if (!req.body.userName || !req.body.password) {
                throw new Error('You have an empty input.')
            };
            let user = await new Promise((resolve, reject) => {

                User.findOne({ userName: req.body.userName }, (err, data) => {
                    if (err) reject(err);
                    if (data) {
                        bcrypt.compare(req.body.password, data.password, function (err, result) {

                            if (result) {
                                resolve(data);
                            }
                            else {
                                reject("your password is incorrect")
                            }


                        });

                    } 
                    else {
                        console.log("not found");
                    }
            })
                   


        })
    console.log(user);
    if (user === null) {
        res.render("pages/signIn", {
            message: (req.cookies.lang === "EN") ? "sorry! can not find an user with this informations." : "متاسفانه کاربری با این اطلاعات یافت نشد",
            theme: req.cookies.theme,
            className: "alert alert-danger",
            lang: req.cookies.lang
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
        message: error.message || error,
        theme: req.cookies.theme,
        className: "alert alert-danger",
        lang: req.cookies.lang
    })
}


    }) ()
});


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

        let user = await User.find({ userName: req.params.author_name })
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


///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// forget password end point ////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

router.get("/forgetPassword", (req, res) => {
    res.render("pages/emailSend", {
        lang: req.cookies.lang,
        theme: req.cookies.theme
    })
})


let verificationCode = Math.floor(Math.random() * Math.pow(10, 6));
let permission = false;
router.post("/sendEmail", async (req, res) => {
    try {
        if (!req.body.userName) {
            throw new Error("empty input")
        }
        let user = await User.find({ userName: req.body.userName });


        console.log(verificationCode);
        let emilTextEn =
            `hey ${user[0].userName}!\n
        A password recovery attempt requires further verification. To complete the password recovery enter the verification code in the recovery page input \n
        and hit the send button.    
        Verification code: ${verificationCode}\n\n
        If you did not attempt to recover your password, it will  expire in 5 minutes.\n

        Thanks,\n
        Amir alamian Articles Team.
        `

        let emilTextFa =
            `!${user[0].userName} سلام\n
         برای بازیابی رمز عبورتان به یک مرحله دیگر نیازمندید. برای بازیابی رمز عبور خود کدی که در پایین قرار دارد را در صفحه بازیابی رمز عبور وارد کنید و دکمه ارسال را بزنید.\n
         ${verificationCode}:کد\n\n
         کد مربوطه بعد از 5 دقیقه باطل خواهد شد.\n
         ،با تشکر\n
         تیم مقاله های امیر عالمیان
        `


        let mailOptions = {
            from: 'amiralamianarticles@gmail.com',
            to: user[0].email,
            subject: 'recovery email',
            text: (req.cookies.lang === "EN") ? emilTextEn : emilTextFa
        };

        sendEmail.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                res.status(201).json(new Response(true, user[0], Date.now))
            }
        });


    } catch (error) {

        console.log(error.message);

        res.status(201).json(new Response(true, error.message, Date.now))
    }

})


router.post("/verifyCode", (req, res) => {
    if (+req.body.VerificationCode === verificationCode) {
        permission = true;
        res.status(201).json(new Response(true, "matched", Date.now))
    }
    else {
        res.json(new Response(false, "not matched", Date.now))
    }
})

router.post("/changePassword/:user_id", async (req, res) => {
    if (permission) {
        try {
            if (!req.body.password) {
                throw new Error("empty input")
            }
            req.body.password = await bcrypt.hash(req.body.password, saltRounds);
            let user = await User.findByIdAndUpdate(req.params.user_id, req.body, { new: true });
            console.log(user);
            res.status(201).json(new Response(true, user, Date.now))
        } catch (error) {

            console.log(error.message);
            res.json(new Response(false, error.message, Date.now))
        }

    }


})

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// search end point ///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

router.post("/search", async (req, res) => {
    let result = [];
    try {

        if (!req.body.search) {
            throw new Error("empty input")
        }

        let search = req.body.search.split(" ");

        let articles = await Article.find();
        for (let i = 0, n = articles.length; i < n; i++) {
            for (let j = 0, n1 = search.length; j < n1; j++) {
                if (articles[i].title.toLowerCase().includes(search[j].toLowerCase())) {

                    result.push(articles[i]);
                }
            }
        }

        res.render("pages/searchResult", {
            lang: req.cookies.lang,
            articles: result,
            theme: req.cookies.theme,
            user: (req.session.user) ? req.session.user : null
        })
    } catch (error) {

        console.log(error.message);
        res.json(new Response(false, error.message, Date.now))
    }




})

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// search end point ///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
router.get("/aboutUs", (req, res) => {
    res.render("pages/aboutUs", {
        theme: req.cookies.theme,
        lang: req.cookies.lang,
        user: null
    })
})

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// change language end point //////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
router.post("/changeLang", (req, res) => {
    req.cookies.lang = req.body.language
    res.cookie("lang", req.body.language);
    res.send(new Response(true, "changed", Date.now()))
})

module.exports = router;