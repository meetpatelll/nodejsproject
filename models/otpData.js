const mongoose = require('mongoose')


const otpDataSchema = new mongoose.Schema({

    number: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    time:{
        type:String,
        required: true

    }

})

module.exports = mongoose.model('otpData',otpDataSchema)