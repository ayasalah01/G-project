const express = require("express");
const router = require('express').Router();
const session = require("express-session");
const config = require("../config/config");

router.use(session({secret:config.sessionSecret}));


const {
    signupValidator,
    loginValidator
}= require("../validators/authSPValidator")

const spController = require("../controllers/spControllers");



router.get("/spSignup",spController.getSignup);
router.post("/spSignup",signupValidator,spController.createNewUser);
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
//router.get("/edit",userController.deleteUserProfile);
router.post("/spDelete",spController.deleteUserAccount);
router.post("/spChange",spController.updatePassword);
module.exports = router;