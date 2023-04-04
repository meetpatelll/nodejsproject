const nodemailer = require("nodemailer");
const otpData = require("../models/otpData");
const moment = require("moment/moment");

const sendMail = async (req, res) => {
  let testAccount = await nodemailer.createTestAccount();

  console.log(req.body,"KKKKKK")

  // connect with the smtp
  const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
        user: 'otpsendtest@gmail.com',
        pass: 'loedjwitssornaih'
    }
});

const code = Math.floor(1000 + Math.random() * 9000);
const data= await otpData.findOneAndRemove({ email: req.body.email })

  const userOtp = new otpData({
    email: req.body.email,
    otp: code,
    time: new moment(),
  });
  let a1=await userOtp.save();
  let info = await transporter.sendMail({
    from: '"Myndro" <Myndro@gmail.com>', // sender address
    to: req.body.email, // list of receivers
    subject: "Your verification code", // Subject line
    text: `verification code ${code}`, // plain text body
  });

  console.log("Message sent: %s", info.messageId);
  res.json(info);
};

module.exports = sendMail;