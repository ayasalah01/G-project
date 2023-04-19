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
    try {
        return User.findOne({email:req.body.email})
        .then(user =>{
            if(user) {
                console.log("email is exist")
            //res.render("clientSignup",{message:"email is exist"})
        }
        else{
            return securePassword (req.body.password);
        }
    })
        .then(hashPassword  =>{
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
    })
    } catch (error) {
        console.log(error.message);
    }
}

module.exports ={
    getSignup,
    createNewUser
}