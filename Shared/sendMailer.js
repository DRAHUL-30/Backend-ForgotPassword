const nodemailer = require("nodemailer");

const sendMail = async (email, subject, text) => {
  var transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAILER_USERNAME,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  var mailOption = {
    from: "guvigeeks.gmail.com",
    to: email,
    subject: subject,
    text: text,
  };

  transport.sendMail(mailOption, (error, info) => {
    if (error) {
      console.log("Error in sending mail", error);
    } else {
      console.log("Email send :" + info.response);
    }
  });
};

module.exports = sendMail;
