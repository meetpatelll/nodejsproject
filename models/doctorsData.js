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

    },
    number:{
        type:String,
        required:false
    },
    colorCode:{
        type:String,
        required:false
    }

})

module.exports = mongoose.model('doctorsData',doctorDataSchema)