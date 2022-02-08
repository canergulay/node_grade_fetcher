var nodemailer = require('nodemailer');
require('dotenv').config()

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASSWORD
  }
});

var mailOptions = {
  from:  process.env.MAIL,
  to:  process.env.TO,
  subject: 'YENI NOT ACIKLANDI !!',
  text: 'KOS KONTROL ET YENI NOT GELDI !!'
};

function sendmail(){
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

module.exports = {sendmail}
