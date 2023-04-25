const express = require("express");
const router = require('express').Router();
const session = require("express-session");
const config = require("../config/config");

router.use(session({secret:config.sessionSecret}));



const homeController = require("../controllers/homeController");
const auth = require("../middlewares/authMiddleware");

router.get("/",homeController.getHome);
router.get("/HomeAfterlogin",auth.isLogin,homeController.getHomeAfterlogin);


module.exports = router;