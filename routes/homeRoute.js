const express = require("express");
const router = require('express').Router();
const session = require("express-session");
const config = require("../config/config");

router.use(session({secret:config.sessionSecret}));



const homeController = require("../controllers/homeController");
const auth = require("../middlewares/authMiddleware");

router.get("/",homeController.getHome);
router.get("/HomeAfterlogin",auth.isLogin,homeController.getHomeAfterlogin);
router.get("/tourismCompany",homeController.tourismCompany);
router.get("/hotel",homeController.Hotel);
router.get("/cinema",homeController.Cinema);
router.get("/bazaar",homeController.Bazaar);
router.get("/resort&village",homeController.ResortAndVillage);
router.get("/naturalPreserve",homeController.NaturalPreserve);
router.get("/archaeologicalSite",homeController.ArchaeologicalSite);
router.get("/restaurant&cafe",homeController.RestaurantAndCafe);
router.get("/transportationCompany",homeController.TransportationCompany);
router.get("/order",homeController.getOrder);
router.get("/cart",homeController.getCart);
router.get("/rate",homeController.getRate);
router.get("/sp_profile_forClient",homeController.getSPProfile);



module.exports = router;