const express = require("express");
const router = express.Router();
const path = require("path");
const Users = require("../models/users");
const otpData = require("../models/otpData");
const moment = require("moment/moment");
const multer = require("multer");
const doctorsData = require("../models/doctorsData");
const sendMail = require("../Controller/Email");

const accountSid = "AC247ceb11eeebf6b879ad820df6ed70ca";
const authToken = "f051c64c5d72febc23b8d8c9f5833632";
const secondtoken="6b4afeeea6ceda1abb347a78e5d84067"
const client = require("twilio")(accountSid, authToken);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./tmp/uploads");
  },
  filename: function (req, file, cb) {
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

router.post("/getUserByEmail", async (req, res) => {
  try {
    const user = await Users.find({email:req.body.email});
    if(user.length>0){
        res.json(user);
    }else{
res.json({
    status:false,
    message:"Can't find user with such email number"
})
    }
    
  } catch (err) {
    res.send("Error " + err);
  }
});



router.post("/createUser",upload, async (req, res) => {
let userInfo=await Users.find({ email:req.body.email})
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
            res.json({status:true,
                message:"User created success",
            data:a1});
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
          try {
            const a1 = await user.save();
            res.json({status:true,
            message:"User created success",
        data:a1});
          } catch (err) {
            res.send(err);
          }
    }
}else{
    res.json({
        status:false,
        message:"email already register"
    })
}

 
});

router.post("/updateUser",upload, async (req, res) => {

    let userInfo= await Users.find({email:req.body.email});
    console.log(userInfo,"adbfisbdujsdbjsbjsfdbsjdlbsdjlbvf")

    if(!userInfo.length<=0){
        if(req.file){
        
            const alien = await Users.findOneAndUpdate(
                {email:req.body.email},
                {
                    name: req.body.name,
                    birthdate: req.body.birthdate,
                    email: req.body.email,
                    city: req.body.city,
                    gender: req.body.gender,
                    profileImage: req.file.path,
                   
                  }
              );
              res.json({data:{status:true,
                message:"User updated success",
            data: {
                name: req.body.name,
                birthdate: req.body.birthdate,
                email: req.body.email,
                city: req.body.city,
                gender: req.body.gender,
               
              }}});
        }else{
            const alien = await Users.findOneAndUpdate(
                {email:req.body.email},
                {
                    name: req.body.name,
                    birthdate: req.body.birthdate,
                    email: req.body.email,
                    city: req.body.city,
                    gender: req.body.gender,
                   
                  }
              );
              res.json({status:true,
                message:"User updated success",
            data: {
                name: req.body.name,
                birthdate: req.body.birthdate,
                email: req.body.email,
                city: req.body.city,
                gender: req.body.gender,
               
              }});
        }
    }else{
        res.json({
            status:false,
            message:"No such user "
        })
    }
 
});

/////////////////////////////////////////////////////AUTH OTP////////

router.post("/send", sendMail);



router.post("/verifyOtp", async (req, res) => {
    
  try {
    const number = await otpData.find({ email: req.body.email });
    console.log(number,"JJJJ")
    if (
      number[0].otp == req.body.otp &&
      moment().diff(moment(number[0]?.time), "minute") < 10
    ) {
      await otpData.remove({ email: number[0].email });
      res.json({
        status:true,
        message:"OTP verify"
      });
    } else {
      res.json({
        status:false,
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
