const session = require("express-session");
const User = require("../models/userModel");
const ServiceProvider = require("../models/spModel");
const Services = require("../models/serviceModel");
const Natural= require("../models/natural");


const getHome = async(req,res,next) =>{
    try {
        const hotel = await Services.find({category:"Hotel"});
        const restaurant = await Services.find({category:"Restaurant & Cafe"});
        const resort = await Services.find({category:"Resort & Village"});
        const tourism = await Services.find({category:"Tourism Company"});
        const cinema = await Services.find({category:"Cinema"});
        const bazaar = await Services.find({category:"Bazaar"});
        const transportation = await Services.find({category:"Transportation Company"});
        const Site = await Natural.find({category:"Archaeological Site"});
        const natural = await Natural.find({category:"Natural Preserve"});
        res.render("home1",{data:hotel,rest:restaurant,resort:resort,tourism:tourism,cinema:cinema,bazaar:bazaar,transportation:transportation,Site:Site,natural:natural});
    } catch (error) {
        console.log(error.message);
    }
}
const getHomeAfterlogin = async(req,res,next) =>{
    try {
        const hotel = await Services.find({category:"Hotel"});
        const restaurant = await Services.find({category:"Restaurant & Cafe"});
        const resort = await Services.find({category:"Resort & Village"});
        const tourism = await Services.find({category:"Tourism Company"});
        const cinema = await Services.find({category:"Cinema"});
        const bazaar = await Services.find({category:"Bazaar"});
        const transportation = await Services.find({category:"Transportation Company"});
        const Site = await Natural.find({category:"Archaeological Site"});
        const natural = await Natural.find({category:"Natural Preserve"});
        res.render("HomeAfterlogin",{data:hotel,rest:restaurant,resort:resort,tourism:tourism,cinema:cinema,bazaar:bazaar,transportation:transportation,Site:Site,natural:natural});
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
        const offers = await Natural.find({category:"Natural Preserve"});
        res.render("naturalPreserve",{data:offers});
    } catch (error) {
        console.log(error.message);
    }
}
const ArchaeologicalSite = async(req,res,next)=>{
    try {
        const offers = await Natural.find({category:"Archaeological Site"});
        console.log(offers)
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

// const getRate = async (req,res,next)=>{
//     try {
//         res.render("rate")
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
    //getRate,
    
}