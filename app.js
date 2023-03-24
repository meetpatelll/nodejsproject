const express = require('express')
const mongoose = require('mongoose')
const path =require('path')
const url = 'mongodb+srv://meetp294:Xnm%4012345@cluster0.vyaduxi.mongodb.net/?retryWrites=true&w=majority'
const dotenv = require('dotenv')
dotenv.config()
const app = express()
const bodyParser =  require('body-parser')
const port =process.env.PORT || 5000

mongoose.connect(url, {useNewUrlParser:true,dbName:"Doctor"})
const con = mongoose.connection

con.on('open', () => {
    console.log('connected...')
})


//console.log(path.join(__dirname,"../public"),">>>>>>>>>>>>>");
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(express.static(path.join(__dirname,'./')))

// /app.get("/")

const routes = require('./routes/users')
const { env } = require('process')
app.use('/api/v1',routes)


app.listen(port, () => {
    console.log('Server started')
})