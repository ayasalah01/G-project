const bcrypt = require("bcrypt");
const session = require("express-session");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const Pay = require("../models/payModel");
const config = require("../config/config");
const sendMail = require("../utils/sendEmail")

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
                    //res.session.is_admin= userData.is_admin
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
        const userData = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name,email:req.body.email,phoneNumber:req.body.phoneNumber}})
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
            image:req.body.image
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
    postPayment
}