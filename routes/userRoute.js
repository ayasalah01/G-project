const express = require("express");
const router = require('express').Router();



const userController = require("../controllers/userController");

router.get("/clientSignup",userController.getSignup);
router.post("/clientSignup",userController.createNewUser);



module.exports = router;