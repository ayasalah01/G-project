const express = require("express");
const router = require('express').Router();
const session = require("express-session");
const config = require("../config/config");

router.use(session({secret:config.sessionSecret}));


const {
    signupValidator,
    loginValidator
}= require("../validators/authValidator")

const userController = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");


router.get("/clientSignup",auth.isLogout,userController.getSignup);
router.post("/clientSignup",signupValidator,userController.createNewUser);
router.get("/signin",auth.isLogout,userController.getSignin);
router.post("/signin",loginValidator,userController.postSignin);
router.get("/logout",userController.userlogout);
router.get("/forgetPassword",userController.getforget_Password);
router.post("/forgetPassword",userController.postforget_Password);
router.get("/resetPassword",userController.getReset_Password);
router.post("/resetPassword",userController.postReset_Password);
router.get("/clientProfile",userController.getUserProfile);
router.get("/setting",userController.editUserProfile);
router.post("/setting",userController.updateProfile);
router.get("/edit",userController.deleteUserProfile);
//router.post("/edit",userController.deleteUserAccount);
router.post("/edit",userController.updatePassword);
module.exports = router;