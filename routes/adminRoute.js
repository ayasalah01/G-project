const express = require("express");
const router = require('express').Router();
const session = require("express-session");
const config = require("../config/config");

router.use(session({secret:config.sessionSecret}));



const adminController = require("../controllers/adminController");

router.get("/",adminController.loadLogin);
router.post("/",adminController.postSignin);
router.get("/home",adminController.loadAdminDashbroad);
router.get("/logout",adminController.logout);

module.exports = router;