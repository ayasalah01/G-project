const express = require('express');
const session = require('express-session')
const SessionStore = require('connect-mongodb-session')(session)
const fs = require("fs")
const path = require('path');
const bodyparser = require('body-parser');
const flash = require("connect-flash");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);


// models 
const User = require("./models/userModel");
const ServiceProvider = require("./models/serviceModel");
const Chat = require("./models/chatModel");
//socket io 
var usp = io.of("/user-namespace");

usp.on('connection',async function(socket){
    console.log("User connected");
    var userId = socket.handshake.auth.token
    await User.findByIdAndUpdate({_id:userId},{$set:{is_online:'1'}});

    socket.broadcast.emit("getOnlineUser",{user_id:userId});

    socket.on("disconnect",async function(){
        console.log("User Disconnected");

        var userId = socket.handshake.auth.token
        await User.findByIdAndUpdate({_id:userId},{$set:{is_online:'0'}});
        //user broadcast offline status
        socket.broadcast.emit("getOfflineUser",{user_id:userId});
    });

        //chatting implmentation 
        socket.on("newChat" ,function(data){
        socket.broadcast.emit("loadNewChat",data)

    });
        // load old chat 
        socket.on("existsChat" ,async function(data){
            var chats = await Chat.find({ $or:[
                {sender_id:data.sender_id , receiver_id:data.receiver_id},
                {sender_id:data.receiver_id, receiver_id:data.sender_id},
            ]});
            socket.emit("loadChats",{chats:chats});
        });
});
// usp.on('connection',async function(socket){
//     console.log("Partner connected");

//     var userId = socket.handshake.auth.token
//     await ServiceProvider.findByIdAndUpdate({_id:userId},{$set:{is_online:'1'}});
//     //user broadcast online status
//     socket.broadcast.emit("getOnlineUser",{user_id:userId});

//     socket.on("disconnect",async function(){
//         console.log("Partner Disconnected");

//         var userId = socket.handshake.auth.token
//         await ServiceProvider.findByIdAndUpdate({_id:userId},{$set:{is_online:'0'}});
//         //user broadcast offline status
//         socket.broadcast.emit("getOfflineUser",{user_id:userId});
//     });

//         //chatting implmentation 
//         socket.on("newChat" ,function(data){
//         socket.broadcast.emit("loadNewChat",data)

//     });

// });



const mongoose  = require('mongoose')
const DB_URL = "mongodb://127.0.0.1:27017/mydatabase"

mongoose.set('strictQuery',false)
mongoose.connect(DB_URL,{useNewUrlParser:true},(err)=>{
    if(err) return err;
    console.log("connected to database");
})  



app.set('view engine' , 'ejs')
app.set('views','views')

app.use(express.json());
app.use(express.static(path.join(__dirname,'/asserts')))
app.use(express.static(path.join(__dirname,'./public/userImages')))      //to use style files 
app.use(express.urlencoded({extended:false}));
app.use(flash());

// const STORE = new SessionStore({
//     uri : "mongodb://127.0.0.1:27017/mydatabase",
//     collection:'sessions'
// })

// app.use(session({
//     secret:"this is my secret secret to hash express sessions---",
//     saveUninitialized:false, 
//     store:STORE
// }))

//for router
const adminRouter = require("./routes/adminRoute");
const homeRoute = require("./routes/homeRoute")
const userRoute = require("./routes/userRoute");
const SPRouter = require("./routes/spRoute")
app.use("/",homeRoute);
app.use("/",userRoute);
app.use("/",SPRouter);
app.use("/admin",adminRouter);




server.listen(3000, function(){
    console.log('connected to server');
    io.on("connection",function(socket){
        //console.log("Auth value:"+socket.id);
        socket.on("signIn",function(details){
            socket.broadcast.emit("signIn",details);
        })
    })
})

