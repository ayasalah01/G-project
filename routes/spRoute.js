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
    loginValidator,
    changePassword_Validator,
    resetValidator
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
router.post("/spresetPassword",resetValidator,spController.postReset_Password);
router.get("/spProfile",spController.getUserProfile);
router.get("/spSetting",spController.editUserProfile);
router.post("/spSetting",spController.updateProfile);//id 
router.post("/spDelete",spController.deleteUserAccount);
router.post("/spChange",changePassword_Validator,spController.updatePassword);
router.get("/spVerification",spController.getVerification);
router.post("/spVerification",spController.sendVerificationLink);
router.get("/HomeSPAfterlogin",spController.getPartnerOffer)
router.post("/HomeSPAfterlogin",upload.single('image'),spController.spCreatePost);
router.get('/spReview',spController.getRate);
router.get("/sp_profile_forClient/:id",spController.getSPProfile_forClient);
// router.get("/sp_profile_forCinema",spController.cinemaProfile);
// router.get("/sp_profile_forBazzar",spController.bazzarProfile);
// router.get("/sp_profile_forNatural",spController.naturalProfile);
// router.get("/sp_profile_forToursim",spController.toursimProfile);
// router.get("/sp_profile_forRestor",spController.restorProfile);
// router.get("/sp_profile_forResturant/:id",spController.getProfile);
// router.get("/sp_profile_forSite",spController.asiteProfile);
// router.get("/sp_profile_forTransport",spController.TransportationProfile);
router.get("/spChat",spController.Load_Chat);
router.post("/saveChat",spController.saveChat);
module.exports = router;