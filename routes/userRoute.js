const express = require("express");
const router = require('express').Router();

const {
    signupValidator
}= require("../validators/authValidator")



const userController = require("../controllers/userController");

router.get("/clientSignup",userController.getSignup);
router.post("/clientSignup",signupValidator,userController.createNewUser);
router.get("/signin",userController.getSignin);
router.post("/signin",userController.postSignin);



module.exports = router;