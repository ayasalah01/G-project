const bcrypt = require("bcrypt");
const session = require("express-session");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require('path');

const User = require("../models/userModel");
const ServiceProvider = require("../models/spModel");
const Services = require("../models/serviceModel");
const Chat = require("../models/chatModel");
const Pay = require("../models/payModel");
const config = require("../config/config");
const sendMail = require("../utils/sendEmail");

// bycrpt password
const securePassword = (password)=>{
    try {
        const hashedPassword = bcrypt.hash(password,10);
        return hashedPassword;
    } catch (error) {
        console.log(error.message);
    }
}

// signup
const getSignup = (req,res,next) =>{
    try {
        res.render("clientSignup",{
            pageTitle:"Signup",
        })
    } catch (error) {
        console.log(error.message);
    }
}

const createNewUser = async(req,res,next)=>{
    try{       
        const hashPassword = await securePassword (req.body.password);
        const user = new User({
            username:req.body.username,
            email : req.body.email,
            phoneNumber: req.body.phoneNumber,
            password : hashPassword,
            is_admin: 0
        });
        const userData = await user.save();
        if(userData){
            sendMail.sendVerificationEmail(req.body.email,userData._id);
            res.render("signin",{pageTitle:"Signin",message:"your registration has been successfully Please verify your email"});
        }
        else{
            res.render("signin",{pageTitle:"Signin",message:"your registration has been failed"});
        }
    } 
    catch(err) {
        console.log(err.message)
    }
}
//verify your email
const verifyMail = async(req,res,next)=>{
    try {
        const updateinfo = await User.updateOne({_id:req.query.id},{$set:{is_varified:1 }});
        console.log(updateinfo);
        res.render("verifyEmail")
    } catch (error) {
        console.log(error.message);
    }
}
// login 
const getSignin =(req,res,next)=>{
    try {
            res.render("signin",{
                pageTitle:"Signin",
            })
    } catch (error) {
        console.log(error.message)
    }
}

const postSignin = async(req,res,next)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email:email})
        console.log(userData.email);
        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password);
            if (passwordMatch){
                if(userData.is_varified === 0){
                    res.render("signin",{pageTitle:"Signin",message:"please verify your Email"})
                }
                else{
                    req.session.user_id = userData._id
                    
                res.redirect("/HomeAfterlogin")
                }
            }
            else{
                res.render("signin",{pageTitle:"Signin",message:"email and password is incorrect"})
            }
        }
        else{
            res.render("signin",{pageTitle:"Signin",message:"email and password is incorrect"})
        }
    } catch (error) {
        console.log(error.message)
    }
}
// logout
const userlogout = (req,res,next)=>{
    try {
        if(req.session){

            req.session.destroy((error)=>{
                if(error){
                    console.log(error);
                }
            });
        }
        res.redirect("/")
    } catch (error) {
        console.log(error.message)
    }
}
//forget password
const getforget_Password = (req,res,next)=>{
    try {
        res.render('forgetPassword',{
            pageTitle:"ForgetPassword"
        });
    } catch (error) {
        console.log(error)
        
    }
    
}
const postforget_Password = async(req,res,next)=>{
    try {
        const email = req.body.email;
        const userData = await User.findOne({email:email});
        if(userData)
        {
            const randomString = randomstring.generate();
            const updatedData = await User.updateOne({email:email},{$set:{token:randomString}});
            sendMail.sendResetPasswordMail(userData.email,randomString);
            res.render('forgetPassword',{pageTitle:"ForgetPassword",message:"please check your email"})
        }
        else{
            res.render('forgetPassword',{pageTitle:"ForgtPassword",message:"user email is incorrect"})
        }
    } catch (error) {
        console.log(error.message)
    }
}
const getReset_Password = async(req,res,next)=>{
    try {
        const token = req.query.token;

        const tokenData = await User.findOne({token:token});
        if(tokenData){
            res.render("resetPassword",{pageTitle:"ResetPassword",user_id:tokenData._id});
        }
        else{
            res.render("404",{message:"token is invalid"});
        }
    } catch (error) {
        console.log(error.message);
    }
        
}
const postReset_Password = async(req,res,next)=>{
    try {
        const password = req.body.password;
        const user_id = req.body.user_id;
        const secure_Password = securePassword(password);
        console.log(password)
        await User.findByIdAndUpdate({_id:user_id},{$set:{password:secure_Password ,token:""}});
        res.redirect("/signin")  
        

    } catch (error) {
        console.log(error)

    }
}
//user profile
const getUserProfile = async(req,res,next)=>{
    try {
        const userData = await User.findById({_id:req.session.user_id});
        res.render('clientProfile',{user:userData});
    } catch (error) {
        console.log(error.message)
    }
}
const editUserProfile = async(req,res,next)=>{
    try {
        
        const userData = await User.findById({_id:req.session.user_id})
        if(userData){
            res.render("setting",{user:userData})

        }
        else{
            res.redirect("/HomeAfterlogin")
        }
    } catch (error) {
        console.log(error.message)
    }
}

const updateProfile = async(req,res,next)=>{
    try {
        const userData = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{username:req.body.username,email:req.body.email,phoneNumber:req.body.phoneNumber}})
        res.redirect("/HomeAfterlogin")
    } catch (error) {
        console.log(error.message)
    }
}
const deleteUserAccount = async(req,res,next)=>{
    if(req.body.user_id === req.session.user_id)
    {
    try {
        const user = await User.findByIdAndDelete({_id:req.body.user_id});
        res.redirect("/")
    } catch (error) {
        console.log(error.message)
    }
}
}

const updatePassword = async(req,res,next)=>{
    try {
        //const user_id = req.session.user_id;
        //const password = req.body.password;
        const hashPassword = await securePassword (req.body.password);
        User.findByIdAndUpdate({_id:req.body.user_id},{$set:{password:hashPassword}});
        res.redirect("/HomeAfterlogin");
    } catch (error) {
        console.log(error.message);
    }
}
const getVerification = (req,res,next)=>
{
    try {
        res.render("verification",{pageTitle:"verification Email"});
    } 
    catch (error) {
        console.log(error.message);
    }
}
const sendVerificationLink = async (req,res,next)=>{
    try {
        const email = req.body.email;
        const userData = await User.findOne({email:email});
        console.log(userData.email)
        if(userData){
            sendMail.sendVerificationEmail(userData.email,userData._id);
            res.render("signin",{pageTitle:"Signin",message:"Reset verification Mail"});
        }
        else{
            res.render("verification",{pageTitle:"verification Email",message:"this mail is not exist"})
        }
    } 
    catch (error) {
        console.log(error.message);
    }
}
const getPayment = (req,res,next)=>{
    try {
        res.render("pay");
    } catch (error) {
        console.log(error.message);
    }
}
const postPayment = async(req,res,next)=>{
    try {
        const pay = new Pay({
            image:req.file.filename
        });
        const data = await pay.save();
        if(data){
            res.render('pay',{message:"payment process has been successfully "})
        }
        else{
            res.render('pay',{message:"payment process has been failed please try again "})
        }
    } catch (error) {
        console.log(error.message);
    }
}

// get serviceprovider profile for client
const get_SP_Profile = async(req,res,next)=>{
    try {
        const users = await Services.findOne({})
        res.render("sp_profile_forClient",{data:users})
    } catch (error) {
        console.log(error.message);
    }
}

//chat dashborad
const Load_Chat = async(req,res,next)=>{
    try {
            const user = await User.findById({_id:req.session.user_id});
            const userData = await Services.findOne({category:"Hotel"});
            console.log(userData.serviceName);
            const data = await ServiceProvider.findOne({serviceName:userData.serviceName});
            console.log(data);
            res.render("clientChat",{
                user:user,
                users:data
            
        })
        
        
    } catch (error) {
        console.log(error.message);
    }
}
const loadChatDashboard = async(req,res,next)=>{
    try {
        const userData = await User.findById({_id:req.session.user_id});
        //const users = await ServiceProvider.find().populate("User_id").select("email")
        const users = await ServiceProvider.find()
        res.render("clientChat",{
            user:userData,
            users:users
            
        })
        console.log(users);
    } catch (error) {
        console.log(error.message);
    }
}

const saveChat = async(req,res,next)=>{
    try {
        const chat = new Chat({
            sender_id :req.body.sender_id,
            receiver_id:req.body.receiver_id,
            message:req.body.message
        })
        const newChat = await chat.save();
        res.status(200).send({success:true,msg:"chat inserted",data:newChat});
    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }
}

const ChatDashboard = async(req,res,next)=>{
    try {
        const userData = await User.findById({_id:req.session.user_id});
        const users = await ServiceProvider.find()
        res.render("chat",{
            user:userData,
            users:users
            
        })
        console.log(users);
    } catch (error) {
        console.log(error.message);
    }
}

module.exports ={
    getSignup,
    createNewUser,
    verifyMail,
    getSignin,
    postSignin,
    userlogout,
    getforget_Password,
    postforget_Password,
    getReset_Password,
    postReset_Password,
    getUserProfile,
    editUserProfile,
    updateProfile,
    deleteUserAccount,
    updatePassword,
    getVerification,
    sendVerificationLink,
    getPayment,
    postPayment,
    loadChatDashboard,
    Load_Chat,
    saveChat,
    ChatDashboard,
    get_SP_Profile
}