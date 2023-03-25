const mongoose = require('mongoose')


const userRegistrationSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    birthdate: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    gender:{
        type: String,
        required: true,
    },
    profileImage:{
        type:String,
        required:false
    }

})

module.exports = mongoose.model('Users',userRegistrationSchema)