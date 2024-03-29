const nodemailer = require('nodemailer');
require('dotenv').config();

function sendMail(email, htmlMessage, subject = "Expense Report") {

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    html: htmlMessage,
  };

  // Create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('      Error sending email');
    } else {
      console.log('      Email sent');
    }
  });
  
}

module.exports = { sendMail };