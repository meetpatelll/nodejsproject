const express = require("express");
const router = express.Router();
const path = require("path");
const Users = require("../models/users");
const otpData = require("../models/otpData");
const moment = require("moment/moment");
const multer = require("multer");
const doctorsData = require("../models/doctorsData");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("zdfnsinisfni");
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});


var upload = multer({ storage: storage }).single("file");

router.get("/getDoctorList", async (req, res) => {
  try {
    const user = await doctorsData.find();
    console.log(doctorsData, "rarstrdtfyguh", user);
    res.send(user);
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/getUserList", async (req, res) => {
  try {
    const user = await Users.find();
    res.json(user);
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/", (req, res) => {
  res.send("jadkbhsbvhkb");
});

router.post("/createUser", upload, async (req, res) => {
  console.log(req.file, "FFFFFFFFFFFFFile");
  const user = new Users({
    name: req.body.name,
    birthdate: req.body.birthdate,
    email: req.body.email,
    city: req.body.city,
    gender: req.body.gender,
    profileImage: req.file.path,
  });
  try {
    const a1 = await user.save();
    res.json(a1);
  } catch (err) {
    res.send(err);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const alien = await Users.findOneAndUpdate(
      { _id: req.params.id },
      req.body
    );

    res.json(alien);
  } catch (err) {
    res.send("Error");
  }
});

/////////////////////////////////////////////////////AUTH OTP////////

router.post("/send", async (req, res) => {
  const code = Math.floor(1000 + Math.random() * 9000);
  const userOtp = new otpData({
    number: req.body.number,
    otp: code,
    time: new moment(),
  });
  try {
    const a1 = await userOtp.save();
    await client.messages.create({
      body: ` hi rahul your code is ${code}`,
      from: "+15077057426",
      to: "+917041200380",
    });
    res.json(a1);
  } catch (err) {
    res.send(err);
  }
});

router.post("/resend", async (req, res) => {
  const code = Math.floor(1000 + Math.random() * 9000);
  try {
    await otpData.findOneAndUpdate(
      { number: req.body.number },
      { otp: code, time: new moment() }
    );
    await client.messages.create({
      body: ` hi rahul your code is ${code}`,
      from: "+15077057426",
      to: "+917041200380",
    });
    res.json("otp re-send");
  } catch (err) {
    res.send(err);
  }
});

router.post("/verifyOtp", async (req, res) => {
  try {
    const number = await otpData.find({ number: req.body.number });
    if (
      number[0].otp == req.body.otp &&
      moment().diff(moment(number[0]?.time), "minute") < 10
    ) {
      await otpData.remove({ number: number[0].number });
      res.send("otp verify");
    } else {
      res.send("invaild otp");
    }
  } catch (err) {
    res.send("Error " + err);
  }
});

router.post("/createDoctor", async (req, res) => {
  const user = new doctorsData({
    name: req.body.name,
    Exp: req.body.Exp,
    prof: req.body.prof,
  });
  console.log(user, ">>>>>>");
  try {
    const a1 = await user.save();
    res.json(a1);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
