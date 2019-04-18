
const nodemailer = require('nodemailer');
// //const { logger } = require('../configuration/logger');

// const mailAccountEmailId = require('./keys').MAIL_USER;
// const mailAccountPassword = require('./keys').MAIL_PASS;


/* --------------- SMTP server configuration ------------------*/

var smtpConfig = {
 host: 'webmail.daiict.ac.in',
 port: 465,
 secureConnection: true,
 tls: false,
 auth: {
 user: '201601150@daiict.ac.in',
 pass: 'Rk@2018#'
 }
};

var smtpTransport = nodemailer.createTransport(smtpConfig);


// var mailOptions = {
//   from: '201601150@daiict.ac.in',
//   to: 'ravikachhadiya1998@gmail.com',
//   subject: 'Sending Email using Node.js',
// };

// const transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });

const sendMail = async (from,to,subject,html,text) => {
  const info = await smtpTransport.sendMail({
      from ,
      to,
      subject,
      html,
      text
  }, function (err, info) {
      if(err) {
          console.log(err);
      } else {
        console.log(info);
      }
   });
};



module.exports = {
 smtpTransport,
 sendMail
}



