const bcrypt = require("bcrypt");

const User = require("../models/userModel");

const securePassword = (password)=>{
    try {
        const hashedPassword = bcrypt.hash(password,10);
        return hashedPassword;
    } catch (error) {
        console.log(error.message);
    }
}

const getSignup = (req,res,next) =>{
    try {
        res.render("clientSignup")
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
        if(userData){
            res.render("home1",{message:"your registration has been successfully"});
        }
        else{
            res.render("clientSignup",{message:"your registration has been failed"})
        }
    } catch(err) {
        console.log(err.message)
    }
}
// login 
const getSignin =(req,res,next)=>{
    try {
        try {
            res.render("signin")
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
                res.redirect("HomeAfterlogin")
            }
            else{
                res.render("signin",{message:"email and password is incorrect"})
            }
        }
        else{
            res.render("signin",{message:"email and password is incorrect"})
        }
    } catch (error) {
        console.log(error.message)
    }
}

module.exports ={
    getSignup,
    createNewUser,
    getSignin,
    postSignin
}