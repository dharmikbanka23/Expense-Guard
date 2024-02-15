const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

function sendMail(email, htmlMessage) {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Wellness Report',
    html: htmlMessage,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

module.exports = sendMail;