const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');


const mongoose  = require('mongoose')
const DB_URL = "mongodb://127.0.0.1:27017/mydatabase"

mongoose.set('strictQuery',false)
mongoose.connect(DB_URL,{useNewUrlParser:true},(err)=>{
    if(err) return err;
    console.log("connected to database")
})  
const app = express();

app.set('view engine' , 'ejs')
app.set('views','views')


app.use(express.static(path.join(__dirname,'asserts')))     //to use style files 
app.use(express.urlencoded({extended:false}));

//for router
const homeController = require("./routes/homeRoute")
const userRoute = require("./routes/userRoute");
const SPRouter = require("./routes/spRoute")
app.use("/",homeController);
app.use("/",userRoute);
app.use("/",SPRouter);


app.listen(3000, ()=>{
    console.log('connected to server')
})