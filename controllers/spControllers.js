const bcrypt = require("bcrypt");
const session = require("express-session");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");

const ServiceProvider = require("../models/spModel");
const config = require("../config/config");



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
                html:'<p>Hi please click here to <a href="http://localhost:3000/resetPassword?token='+token+'">Reset</a> your password.</p>'
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
        const userData = user.save();
        if(userData){
            res.render("spSignin",{pageTitle:"Signin",message:"your registration has been successfully"});
        }
        else{
            res.render("spSignup",{pageTitle:"Signup",message:"your registration has been failed"})
        }
    } catch(err) {
        console.log(err.message)
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
                req.session.serviceProvider_id = userData._id
                res.redirect("/HomeSPAfterlogin")
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
        const userData =  ServiceProvider.findOne({email:email});
        if(userData)
        {
            const randomString = randomstring.generate();
            const updatedData = ServiceProvider.updateOne({email:email},{$set:{token:randomString}});
            sendResetPasswordMail(userData.email,randomString);
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
        User.findByIdAndUpdate({_id:user_id},{$set:{password:secure_Password,token:""}})
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
        
        const userData = await ServiceProvider.findById({_id:req.session.serviceProvider_id})
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
        const userData = await ServiceProvider.findByIdAndUpdate({_id:req.body.serviceProvider_id},{$set:{name:req.body.name,serviceName:req.body.serviceName,email:req.body.email,Address:req.body.Address}})
        res.redirect("/HomeSPAfterlogin")
    } catch (error) {
        console.log(error.message)
    }
}
const deleteUserProfile = async(req,res,next)=>{
    try {
        //const id = req.query.id;
        const userData = await ServiceProvider.findById({_id:req.session.serviceProvider_id})
        if(userData){
            res.render("edit",{user:userData})

        }
        else{
            res.redirect("/HomeAfterlogin")
        }
    } catch (error) {
        console.log(error.message)
    }
}

const deleteUserAccount = async(req,res,next)=>{
    try {
        ServiceProvider.deleteOne({email:req.body.email});
        res.redirect("/")
    } catch (error) {
        console.log(error.message)
    }
}

const updatePassword = async(req,res,next)=>{
    const session = req.session;
    if (session.email){
        const oldPassword = req.body.password;
        const newPassword = req.body.newpassword;
        const confirmPassword = req.body.cnfirmpassword;
        User.findOne({email:session.email})

    }
}

module.exports ={
    getSignup,
    createNewUser,
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
    deleteUserProfile,
    deleteUserAccount,
    updatePassword
}