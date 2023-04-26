const bcrypt = require("bcrypt");
const session = require("express-session");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const validationResult = require("express-validator").validationResult;

const User = require("../models/userModel");
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
        res.render("clientSignup",{
            pageTitle:"Signup",
            authError:req.flash('authError')[0],
            validationErrors:req.flash('validationErrors')
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
        const userData = user.save();
        if(validationResult(req).isEmpty()){
            res.render("signin",{pageTitle:"Signin",message:"your registration has been successfully"})
            .catch(err =>{
                console.log(err)
                req.flash('authError',err)
                res.redirect('/clientSignup',{pageTitle:"Signup"}) 
            })
        }
        else{
            req.flash('validationErrors',validationResult(req).array())
            res.redirect("clientSignup",{pageTitle:"Signup"})
        }
    } catch(err) {
        console.log(err.message)
    }
}
// login 
const getSignin =(req,res,next)=>{
    try {
        try {
            res.render("signin",{
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

        const userData = await User.findOne({email:email})
        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password);
            if (passwordMatch){
                req.session.user_id = userData._id
                res.redirect("/HomeAfterlogin")
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
    /*
    const {email} = req.body
    try {
        const oldUser = await User.findOne({email});
        if (!oldUser){
            return res.send("there is no user matches this email ")
        }
        const secret = config.JWT_SECRET + oldUser.password
        const payload = {
            email:oldUser.email,
            id: oldUser._id
        }
        const token = jwt.sign(payload,secret,
            {
                expiresIn :"15m"
            })
            const link = `http://localhost:3000/resetPassword/${oldUser._id}/${token}`
            const transporter = nodemailer.createTransport({
                host:'smtp.gmail.com',
                port:587,
                secure:false,
                requireTLS:true,
                auth: {
                    user: config.emailUser,
                    pass:config.passwordUser
                }
            });
            
            var mailOptions = {
                from: config.emailUser,
                to: oldUser.email,
                subject: 'password Reset',
                html:'<p>Hi please click here to <a href=`http://localhost:3000/resetPassword/${oldUser._id}/${token}`>Reset</a> your password.</p>'
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            console.log(link)
        } 
        catch (error) {
            res.send(error)
            console.log(error)
        }
    }*/
    try {
        const email = req.body.email;
        const userData = await User.findOne({email:email});
        if(userData)
        {
            const randomString = randomstring.generate();
            const updatedData = User.updateOne({email:email},{$set:{token:randomString}});
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


const getReset_Password = (req,res,next)=>{
    /*
    const {id,token} = req.params;
    const oldUser =  User.findOne({_id:id});
    if (!oldUser){
        return res.send("there is no user matches this email ")
    }
    const secret = config.JWT_SECRET + oldUser.password;
    try {
        const verify = jwt.verify(token,secret)
        res.render("resetPassword")
    } 
    catch (error) {
        res.send("not valid")
        console.log(error)
    }  
    */
    try {
        const token = req.query.token;

        const tokenData = User.findOne({token:token});
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
const postReset_Password = (req,res,next)=>{
    /*
    const {id ,token} = req.params;
    const {password} = req.body;
    const oldUser = User.findOne({_id:id});
        if (!oldUser){
            return res.send("there is no user matches this email ")
        }
    const secret = config.JWT_SECRET + oldUser.password;
    try {
        const verify = jwt.verify(token,secret);
        const newencryptedPassword = securePassword(password);
        User.updateOne(
            {
                _id:id
            },
            {
                $set:{
                    password:newencryptedPassword
                },
            }
        );
        res.json({status:"password updated"})
    } 
    catch (error) {
        res.send(error)
        //res.send("some thing wrong")
        console.log(error)
    }  
    */
    try {
        const password = req.body.password;
        const user_id = req.body.user_id;
        console.log(user_id);
        const secure_Password = securePassword(password);
        User.findByIdAndUpdate({_id:user_id},{$set:{password:secure_Password,token:""}})
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
const deleteUserProfile = async(req,res,next)=>{
    try {
        //const id = req.query.id;
        const userData = await User.findById({_id:req.session.user_id})
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
        User.deleteOne({email:req.body.email});
        res.redirect("/")
    } catch (error) {
        console.log(error.message)
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