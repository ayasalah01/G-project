const express = require("express");
const router = require('express').Router();
const session = require("express-session");
const config = require("../config/config");
const multer = require("multer");
const path = require('path');

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,"../public/userImages"));
    },
    filename:(req,file,cb)=>{
        cb(null, file.originalname + '-' + Date.now()) 
        
    }
})
const upload = multer({storage:storage});

router.use(session({secret:config.sessionSecret}));


const {
    signupValidator,
    loginValidator
}= require("../utils/validators/authSPValidator")

const spController = require("../controllers/spControllers");



router.get("/spSignup",spController.getSignup);
router.post("/spSignup",signupValidator,spController.createNewUser);
router.get("/spVerify",spController.verifyMail);
router.get("/spSignin",spController.getSignin);
router.post("/spSignin",loginValidator,spController.postSignin);
router.get("/logout",spController.userlogout);
router.get("/spforgetPassword",spController.getforget_Password);
router.post("/spforgetPassword",spController.postforget_Password);
router.get("/spresetPassword",spController.getReset_Password);
router.post("/spresetPassword",spController.postReset_Password);
router.get("/spProfile",spController.getUserProfile);
router.get("/spSetting",spController.editUserProfile);
router.post("/spSetting",spController.updateProfile);//id 
router.post("/spDelete",spController.deleteUserAccount);
router.post("/spChange",spController.updatePassword);
router.get("/spVerification",spController.getVerification);
router.post("/spVerification",spController.sendVerificationLink);
router.get("/HomeSPAfterlogin",spController.getPartnerOffer)
router.post("/HomeSPAfterlogin",upload.single('image'),spController.createPost);
router.get('/spReview',spController.getRate);
//router.get("/sp_profile_forClient",spController.HotelPost);
module.exports = router;