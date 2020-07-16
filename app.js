const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose =require("mongoose");
const api = require('./routes/api');
const session = require('express-session');

const app = express();


///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////setting up session/////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

app.use(session({
	key:"user_sid",
	secret:"somerandomstuff",
	resave: false,
    saveUninitialized: false,
    cookie: {
		expires: 600000,
    }
}));


app.use(cookieParser());

app.use(function(req, res, next) {
	if (req.cookies.user_sid && !req.session.user) {
		res.clearCookie("user_sid");
	};

	next();
});

// app.use((req, res, next) => {
// 	console.log(req.cookies,"cokkiess");
// 	console.log(req.session,"sessionABD");
// 	next();
// });


app.use(function(req, res, next){
	if(!req.cookies.theme){
		res.cookie('theme',"light" );
	}
	
	next();
});

///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////view engine setup/////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
app.set("view engine", "ejs");



///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////data base setup///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

// handle mongoose collection.ensureIndex warn
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect('mongodb://localhost:27017/article-bloger-comments', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////end points and midlles wares/////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', api);




app.listen("8080",()=>{
	console.log("up and running on 8080");
})

// module.exports = app;
