const bcrypt = require("bcrypt");
const session = require("express-session");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");

const ServiceProvider = require("../models/spModel");
const config = require("../config/config");
const sendMail = require("../utils/sendEmail");


//send verify mail
const sendVerificationMail = (email,serviceProvider_id)=>{
    try {
        const transporter = nodemailer.createTransport
        ({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.passwordUser
            }
        });
            const mailOptions = {
                from: config.emailUser,
                to: email,
                subject: 'For verification Mail',
                html:'<p>Hi please click here to <a href="http://localhost:3000/spVerify?id='+serviceProvider_id+'">Verify</a> your Email.</p>'
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            })

    } catch (error) {
        console.log(error)
    }

}

//const send mail
const sendResetPasswordMail = (email,token)=>{
    try {
        const transporter = nodemailer.createTransport
        ({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.passwordUser
            }
        });
            const mailOptions = {
                from: config.emailUser,
                to: email,
                subject: 'password Reset',
                html:'<p>Hi please click here to <a href="http://localhost:3000/spresetPassword?token='+token+'">Reset</a> your password.</p>'
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            })

    } catch (error) {
        console.log(error)
    }

}
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
        res.render("spSignup",{
            pageTitle:"Signup"
        })
    } catch (error) {
        console.log(error.message);
    }
}

const createNewUser = async(req,res,next)=>{
    try{
        const hashPassword = await securePassword (req.body.password);
        const user = new ServiceProvider({
            serviceName:req.body.serviceName,
            email : req.body.email,
            Address: req.body.Address,
            password : hashPassword,
            category:req.body.category,
        });
        const userData = await user.save();
        console.log(userData._id)
        if(userData){
            sendVerificationMail(req.body.email,userData._id)
            res.render("spSignin",{pageTitle:"Signin",message:"your registration has been successfully Please verfiy your email"});
        }
        else{
            res.render("spSignup",{pageTitle:"Signup",message:"your registration has been failed"})
        }
    } catch(err) {
        console.log(err.message)
    }
}
//verify your email
const verifyMail = async(req,res,next)=>{
    try {
        const updateinfo = await ServiceProvider.updateOne({_id:req.query.id},{$set:{is_varified:1 }});
        console.log(updateinfo);
        res.render("spVerifyEmail")
    } catch (error) {
        console.log(error.message);
    }
}
// login 
const getSignin =(req,res,next)=>{
    try {
        try {
            res.render("spSignin",{
                pageTitle:"Signin",
            })
        } catch (error) {
            console.log(error.message);
        }
    } catch (error) {
        console.log(error.message)
    }
}
const postSignin = async(req,res,next)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await ServiceProvider.findOne({email:email})
        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password);
            if (passwordMatch){
                if(userData.is_varified === 0){
                    res.render("spSignin",{pageTitle:"Signin",message:"please verify your Email"})
                }
                else{
                req.session.serviceProvider_id = userData._id
                res.redirect("/HomeSPAfterlogin")
                }
            }
            else{
                res.render("spSignin",{pageTitle:"Signin",message:"email and password is incorrect"})
            }
        }
        else{
            res.render("spSignin",{pageTitle:"Signin",message:"email and password is incorrect"})
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
        res.render('spforgetPassword',{
            pageTitle:"ForgetPassword"
        });
    } catch (error) {
        console.log(error)
        
    }
    
}
const postforget_Password = async(req,res,next)=>{
    try {
        const email = req.body.email;
        const userData =  await ServiceProvider.findOne({email:email});
        console.log(userData.email)
        if(userData)
        {
            const randomString = randomstring.generate();
            const updatedData = ServiceProvider.updateOne({email:email},{$set:{token:randomString}});
            sendResetPasswordMail(userData.email,randomString);
            res.render('spforgetPassword',{pageTitle:"ForgetPassword",message:"please check your email"})
        }
        else{
            res.render('spforgetPassword',{pageTitle:"ForgtPassword",message:"user email is incorrect"})
        }
    } catch (error) {
        console.log(error.message)
    }

}
const getReset_Password = async(req,res,next)=>{
    try {
        const token = req.query.token;

        const tokenData =  ServiceProvider.findOne({token:token});
        if(tokenData){
            res.render("spresetPassword",{pageTitle:"ResetPassword",serviceProvider_id:tokenData._id});
        }
        else{
            res.render("404",{message:"token is invalid"});
        }
    } catch (error) {
        console.log(error.message);
    }
        
}
const postReset_Password = (req,res,next)=>{
    try {
        const password = req.body.password;
        const user_id = req.body.serviceProvider_id;
        console.log(user_id);
        const secure_Password = securePassword(password);
        ServiceProvider.findByIdAndUpdate({_id:user_id},{$set:{password:secure_Password,token:""}})
        res.redirect("/spSignin")

    } catch (error) {
        console.log(error)

    }
}

//user profile
const getUserProfile = async(req,res,next)=>{
    try {
        const userData = await ServiceProvider.findById({_id:req.session.serviceProvider_id});
        res.render('spProfile',{user:userData});
    } catch (error) {
        console.log(error.message)
    }
}
const editUserProfile = async(req,res,next)=>{
    try {
        
        const userData = await ServiceProvider.findById({_id:req.session.serviceProvider_id});
        if(userData){
            res.render("spSetting",{user:userData})
        }
        else{
            res.redirect("/HomeSPAfterlogin")
        }
    } catch (error) {
        console.log(error.message)
    }
}

const updateProfile = async(req,res,next)=>{
    try {
        const user_id = await req.body.serviceProvider_id
        console.log(user_id);
        const userData = await ServiceProvider.findByIdAndUpdate({_id:user_id},{$set:{name:req.body.name,serviceName:req.body.serviceName,email:req.body.email,phoneNumber:req.body.phoneNumber,Address:req.body.Address}})
        res.redirect("/HomeSPAfterlogin")
    } catch (error) {
        console.log(error.message)
    }
}

const deleteUserAccount = async(req,res,next)=>{
    if(req.body.serviceProvider_id === req.session.serviceProvider_id){
    try {
        console.log(req.body.serviceProvider_id);
        await ServiceProvider.findByIdAndDelete({_id:req.body.serviceProvider_id});
        res.redirect("/")
    } catch (error) {
        console.log(error.message)
    }
}
}

const updatePassword = async(req,res,next)=>{
    try {
        //const user_id = req.session.serviceProvider_id;
        const password = req.body.password;
        const newPassword = await securePassword(password);
        const changeData = ServiceProvider.findByIdAndUpdate({_id:req.body.serviceProvider_id},{$set:{password:newPassword}});
            res.redirect("/HomeSPAfterlogin");
    } catch (error) {
        console.log(error.message);
    }
}
const getVerification = (req,res,next)=>
{
    try {
        res.render("spVerification",{pageTitle:"verification Email"});
    } 
    catch (error) {
        console.log(error.message);
    }
}
const sendVerificationLink = async (req,res,next)=>{
    try {
        const email = req.body.email;
        const userData = await ServiceProvider.findOne({email:email});
        console.log(userData.email)
        if(userData){
            sendVerificationMail(userData.email,userData._id);
            res.render("spSignin",{pageTitle:"Signin",message:"Reset verification Mail"});
        }
        else{
            res.render("spVerification",{pageTitle:"verification Email",message:"this mail is not exist"})
        }
    } 
    catch (error) {
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
    sendVerificationLink
}