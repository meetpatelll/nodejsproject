const mongoose = require('mongoose')


const doctorDataSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    Exp: {
        type: String,
        required: true
    },
    prof:{
        type:String,
        required: true

    }

})

module.exports = mongoose.model('doctorsData',doctorDataSchema)