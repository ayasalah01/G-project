const express = require("express");
const router = require('express').Router();
const session = require("express-session");
const config = require("../config/config");
const multer = require("multer");
const path = require('path');


const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,"../public/payment"));
    },
    filename:(req,file,cb)=>{
        cb(null, file.originalname + '-' + Date.now()) 
        
    }
})
const upload = multer({storage:storage});


router.use(session({secret:config.sessionSecret}));

const {
    signupValidator,
    loginValidator,
    changePassword_Validator,
    resetValidator,
    rateValidator
}= require("../utils/validators/authValidator")

const userController = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");


router.get("/clientSignup",auth.isLogout,userController.getSignup);
router.post("/clientSignup",signupValidator,userController.createNewUser);
router.get("/verify",userController.verifyMail);
router.get("/signin",auth.isLogout,userController.getSignin);
router.post("/signin",loginValidator,userController.postSignin);
router.get("/logout",userController.userlogout);
router.get("/forgetPassword",userController.getforget_Password);
router.post("/forgetPassword",userController.postforget_Password);
router.get("/resetPassword",userController.getReset_Password);
router.post("/resetPassword",resetValidator,userController.postReset_Password);
router.get("/verification",userController.getVerification);
router.post("/verification",userController.sendVerificationLink);
router.get("/clientProfile",userController.getUserProfile);
router.get("/setting",userController.editUserProfile);
router.post("/updateProfile",userController.updateProfile);
router.post("/delete",userController.deleteUserAccount);
router.post("/change",changePassword_Validator,userController.update_password);
router.get("/pay/:id",userController.getPayment);
//router.get("/pay",userController.getPay);
router.post("/pay",upload.single('image'),userController.postPayment);
router.get("/clientChat/:id",userController.Load_Chat);
router.post("/saveChat",userController.saveChat);
//router.get("/chat",userController.ChatDashboard);//try with it 
router.get("/cart",userController.getCart);
router.post("/cart",upload.single('image'),userController.addToCart);
router.post("/cart/update",userController.updateItem);
router.post("/cart/delete",userController.deleteItem);
router.post("/order",userController.createOrder);
router.get("/search",userController.getSearch);
router.post("/search",userController.postSearch);
router.get("/edit/:id",userController.get_SP_Profile);
router.get("/rate/:id",userController.getRate);
router.post ("/rate",rateValidator,userController.review);
router.get("/rate",userController.getReview)
module.exports = router;