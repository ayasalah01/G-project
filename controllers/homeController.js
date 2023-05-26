const session = require("express-session");
const MongoClient = require('mongodb').MongoClient
const User = require("../models/userModel");
const ServiceProvider = require("../models/spModel");
const Services = require("../models/serviceModel");
const { emailUser } = require("../config/config");

const getHome = (req,res,next) =>{
    try {
        res.render("home1");
    } catch (error) {
        console.log(error.message);
    }
}
const getHomeAfterlogin = (req,res,next) =>{
    try {
        res.render("HomeAfterlogin");
    } catch (error) {
        console.log(error.message);
    }
}
// display services
const tourismCompany = async(req,res,next)=>{
    try {
        const offers = await Services.find({category:"Tourism Company"});
        res.render("tourismCompany",{data:offers});
    } catch (error) {
        console.log(error.message);
    }
}
const Hotel = async(req,res,next)=>{
    try {
        const offers = await Services.find({category:"Hotel"});
        res.render("hotel",{data:offers});
    
    } catch (error) {
        console.log(error.message);
    }
}
const Cinema = async(req,res,next)=>{
    try {
        const offers = await Services.find({category:"Cinema"});
        res.render("cinema",{data:offers});
    } catch (error) {
        console.log(error.message);
    }
}
const Bazaar = async(req,res,next)=>{
    try {
        const offers = await Services.find({category:"Bazaar"});
        res.render("bazaar",{data:offers});
    } catch (error) {
        console.log(error.message);
    }
}
const ResortAndVillage = async(req,res,next)=>{
    try {
        const offers = await Services.find({category:"Resort & Village"});
        res.render("resort&village",{data:offers});
    } catch (error) {
        console.log(error.message);
    }
}
const NaturalPreserve = async(req,res,next)=>{
    try {
        const offers = await Services.find({category:"Natural Preserve"});
        res.render("naturalPreserve",{data:offers});
    } catch (error) {
        console.log(error.message);
    }
}
const ArchaeologicalSite = async(req,res,next)=>{
    try {
        const offers = await Services.find({category:"Archaeological Site"});
        res.render("archaeologicalSite",{data:offers});
    } catch (error) {
        console.log(error.message);
    }
}
const RestaurantAndCafe = async(req,res,next)=>{
    try {
        const offers = await Services.find({category:"Restaurant & Cafe"});
        res.render("restaurant&cafe",{data:offers});
    } catch (error) {
        console.log(error.message);
    }
}
const TransportationCompany = async(req,res,next)=>{
    try {
        const offers = await Services.find({category:"Transportation Company"});
        res.render("transportationCompany",{data:offers});
    } catch (error) {
        console.log(error.message);
    }
}
// get order page
const getOrder = async (req,res,next)=>{
    try {
        res.render("order")
    } catch (error) {
        console.log(error.message);
    }
}

const getCart = async (req,res,next)=>{
    try {
        res.render("cart")
    } catch (error) {
        console.log(error.message);
    }
}
const getRate = async (req,res,next)=>{
    try {
        res.render("rate")
    } catch (error) {
        console.log(error.message);
    }
}

// const getSPProfile = async (req,res,next)=>{
//     try {
//         res.render("sp_profile_forClient")
//     } catch (error) {
//         console.log(error.message);
//     }
// }
module.exports ={
    getHome,
    getHomeAfterlogin,
    tourismCompany,
    Hotel,
    Cinema,
    Bazaar,
    ResortAndVillage,
    NaturalPreserve,
    ArchaeologicalSite,
    RestaurantAndCafe,
    TransportationCompany,
    getOrder,
    getCart,
    getRate,
    
}