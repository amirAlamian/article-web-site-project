var nodemailer = require('nodemailer');
require("dotenv").config()
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'amiralamianarticles@gmail.com',
      pass: process.env.EMAILPASSWORD
    }
  });
  
  module.exports= transporter;
