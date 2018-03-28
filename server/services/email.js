const config = require('../config');
const nodemailer = require('nodemailer');

module.exports = {
  register: async function register(data) {
    const url = `http://localhost:4200/confirm/${data.token}`;
    nodemailer.createTestAccount((err, account) => {
      let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: account.user,
          pass: account.pass
        }
      });

      let mailOptions = {
        from: '"Squad Goals" <no-reply@squadgoals.com>',
        to: data.email,
        subject: 'Confirm your account',
        text: `Copy the link into your browser to confirm your account. ${url}`,
        html: `Click the link to confirm your account: <a href="${url}">Confirm</a>`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.error(error);
        }
        console.log(`Message sent: ${info.messageId}`);
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      });
    });
  }
};
