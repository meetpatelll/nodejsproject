const express = require("express");
const router = express.Router();
const path = require("path");
const Users = require("../models/users");
const otpData = require("../models/otpData");
const moment = require("moment/moment");
const multer = require("multer");
const doctorsData = require("../models/doctorsData");

const accountSid = "AC247ceb11eeebf6b879ad820df6ed70ca";
const authToken = "e577131dcfe76be9db4d6bfc6602cabc";
const client = require("twilio")(accountSid, authToken);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./tmp/uploads");
  },
  filename: function (req, file, cb) {
    console.log(file,"nbjfnjbvfjerjb")
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});


var upload = multer({ storage: storage }).single("profileImage");

router.get("/getDoctorList", async (req, res) => {
  try {
    const user = await doctorsData.find();
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

router.post("/getUserByMobile", async (req, res) => {
    console.log(req.query,"jdbuwhdousahohoewu")
  try {
    const user = await Users.find({number:req.body.number});
    console.log(user,"KKKKKKKKKKKKKKKKK")
    res.json(user);
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/", (req, res) => {
  res.send("jadkbhsbvhkb");
});

router.post("/createUser",upload, async (req, res) => {
console.log(req.body,"pasjidoiinfofvuojvnubdbubd")
let userInfo=await Users.find({email:req.body.email})
if(userInfo.length<=0){
    if(req.file){    
        const user = new Users({
            name: req.body.name,
            birthdate: req.body.birthdate,
            email: req.body.email,
            city: req.body.city,
            gender: req.body.gender,
            profileImage: req.file.path,
            number:req.body.number
          });
          try {
            const a1 = await user.save();
            res.json(a1);
          } catch (err) {
            res.send(err);
          }
    }else{
        const user = new Users({
            name: req.body.name,
            birthdate: req.body.birthdate,
            email: req.body.email,
            city: req.body.city,
            gender: req.body.gender,
            number:req.body.number
          });
        console.log(user,"KKKKKKK")
          try {
            const a1 = await user.save();
            res.json(a1);
          } catch (err) {
            res.send(err);
          }
    }
}else{
    res.json({
        status:false,
        message:"Email already register"
    })
}

 
});

router.patch("/updateUser/:id",upload, async (req, res) => {

    let userInfo=await Users.find({ _id: req.params.id })

    if(userInfo.length<=0){
        if(req.file){
            console.log("KKKKKK2222222222222222333333333333333333333")
        
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
        }else{
            const user = new Users({
                name: req.body.name,
                birthdate: req.body.birthdate,
                email: req.body.email,
                city: req.body.city,
                gender: req.body.gender,
              });
              try {
                const a1 = await user.save();
                res.json(a1);
              } catch (err) {
                res.send(err);
              }
        }
    }else{
        res.json({
            status:false,
            message:"Email already register"
        })
    }
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
   const data= await otpData.findOneAndRemove({ number: req.body.number })

  
console.log("KKKKKKKKKKKKKKKKKKKKKKK",code)
  const userOtp = new otpData({
    number: req.body.number,
    otp: code,
    time: new moment(),
  });
  try {
     let a1=await userOtp.save();
    let  data=await client.messages.create({
      body: `code is ${code}`,
      from: "+15855316012",
      to: `+${req.body.number}`,
    });
    res.json(data);
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
      body: `  code is ${code}`,
      from: "+15855316012",
      to: `+${req.body.number}`,
    });
    res.json("otp re-send");
  } catch (err) {
    res.send(err);
  }
});

router.post("/verifyOtp", async (req, res) => {
    
  try {
    const number = await otpData.find({ number: req.body.number });
    console.log(number,"JJJJ")
    if (
      number[0].otp == req.body.otp &&
      moment().diff(moment(number[0]?.time), "minute") < 10
    ) {
      await otpData.remove({ number: number[0].number });
      res.json({
        status:true,
        message:"OTP verify"
      });
    } else {
      res.json({
        status:true,
        message:"invaild otp"
      });
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
    number:req.body.number,
    colorCode:req.body.colorCode
  });
  try {
    const a1 = await user.save();
    res.json(a1);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
