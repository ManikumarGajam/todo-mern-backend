// mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 465,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,  // should be 'apikey'
    pass: process.env.EMAIL_PASS,  // your SendGrid API key
  },
});

module.exports = transporter;
