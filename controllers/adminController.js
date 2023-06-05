const User = require("../models/userModel");
const bcrypt = require("bcrypt");



const loadLogin = (req,res,next)=>{
    try {
        res.render("adminSignin",{pageTitle:"Admin Signin"});
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
                if(userData.is_admin === 0){
                    res.render("adminSignin",{pageTitle:" Admin Signin",message:"email and password is incorrect"})
                }
                else{
                    req.session.user_id = userData._id
                    req.session.is_admin = userData.is_admin
                res.redirect("/admin/home")
                }
            }
            else{
                res.render("adminSignin",{pageTitle:"Admin Signin",message:"email and password is incorrect"})
            }
        }
        else{
            res.render("adminSignin",{pageTitle:"Admin Signin",message:"email and password is incorrect"})
        }
    } catch (error) {
        console.log(error.message)
    }
}
const loadAdminDashbroad = async(req,res,next)=>{
    try {

        res.render("adminHome");
    } catch (error) {
        console.log(error.message);
    }
}
const logout = (req,res,next)=>{
    try {
        if(req.session){

            req.session.destroy((error)=>{
                if(error){
                    console.log(error);
                }
            });
        }
        res.redirect("/admin")
    } catch (error) {
        console.log(error.message)
    }
}
module.exports = {
    loadLogin,
    postSignin,
    loadAdminDashbroad,
    logout
}