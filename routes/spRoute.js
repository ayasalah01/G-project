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
router.get("/forgetPassword",spController.getforget_Password);
router.post("/forgetPassword",spController.postforget_Password);
router.get("/resetPassword",spController.getReset_Password);
router.post("/resetPassword",spController.postReset_Password);
router.get("/spProfile",spController.getUserProfile);
router.get("/spSetting",spController.editUserProfile);
router.post("/spSetting",spController.updateProfile);//id 
//router.get("/edit",userController.deleteUserProfile);
router.post("/delete",spController.deleteUserAccount);
//router.post("/edit",userController.updatePassword);
module.exports = router;