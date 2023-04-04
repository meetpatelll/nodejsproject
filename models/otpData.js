const mongoose = require('mongoose')


const otpDataSchema = new mongoose.Schema({

    email: {
        type: String,
        required: false
    },
    otp: {
        type: String,
        required: false
    },
    time:{
        type:String,
        required: false

    }

})

module.exports = mongoose.model('otpData',otpDataSchema)