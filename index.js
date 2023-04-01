const express = require("express");
const app = express();
const mongoose = require('mongoose')
const path =require('path')
const url = 'mongodb+srv://meetp294:Xnm%4012345@cluster0.vyaduxi.mongodb.net/?retryWrites=true&w=majority'
const dotenv = require('dotenv')
dotenv.config()

const product = require("./api/product");
const user=require("./api/user")
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
app.use(express.static(path.join(__dirname,'./public')))
app.use('/public', express.static('public'));


app.use(express.json({ extended: false }));

app.use("/api/product", product);
app.use("/api/user", user);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));
