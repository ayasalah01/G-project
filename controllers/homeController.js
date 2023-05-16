const session = require("express-session");
const MongoClient = require('mongodb').MongoClient
const User = require("../models/userModel");
const ServiceProvider = require("../models/spModel");
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
        MongoClient.connect('mongodb://127.0.0.1:27017' ,{useNewUrlParser: true}, (err, client)=> {
            var database = client.db("mydatabase");
            database.collection("Tourism Company").find().toArray().then(users =>{
                console.log(users)
                res.render("tourismCompany",{data:users});
            })
            
    })
    } catch (error) {
        console.log(error.message);
    }
}
const Hotel = async(req,res,next)=>{
    try {
        //to get serviceProvider
        MongoClient.connect('mongodb://127.0.0.1:27017' ,{useNewUrlParser: true}, (err, client)=> {
            var database = client.db("mydatabase");
            database.collection("Hotel").distinct("serviceName").then(users =>{
                console.log(users)
            ServiceProvider.findOne({serviceName:users}).then(user =>{
                    console.log(user._id)
            database.collection("Hotel").find().toArray().then(users =>{
                console.log(users)
                res.render("hotel",{data:users,duser:user});
            })
        })
    }) 
    })
    } catch (error) {
        console.log(error.message);
    }
}
const Cinema = async(req,res,next)=>{
    try {
        MongoClient.connect('mongodb://127.0.0.1:27017' ,{useNewUrlParser: true}, (err, client)=> {
            var database = client.db("mydatabase");
            database.collection("Cinema").find().toArray().then(users =>{
                console.log(users)
                res.render("cinema",{data:users});
            })
            
    })
    } catch (error) {
        console.log(error.message);
    }
}
const Bazaar = async(req,res,next)=>{
    try {
        MongoClient.connect('mongodb://127.0.0.1:27017' ,{useNewUrlParser: true}, (err, client)=> {
            var database = client.db("mydatabase");
            database.collection("Bazaar").find().toArray().then(users =>{
                console.log(users)
                res.render("bazaar",{data:users});
            })
            
    })
    } catch (error) {
        console.log(error.message);
    }
}
const ResortAndVillage = async(req,res,next)=>{
    try {
        MongoClient.connect('mongodb://127.0.0.1:27017' ,{useNewUrlParser: true}, (err, client)=> {
            var database = client.db("mydatabase");
            database.collection("Resort & Village").find().toArray().then(users =>{
                console.log(users)
                res.render("resort&village",{data:users});
            })
            
    })
    } catch (error) {
        console.log(error.message);
    }
}
const NaturalPreserve = async(req,res,next)=>{
    try {
        MongoClient.connect('mongodb://127.0.0.1:27017' ,{useNewUrlParser: true}, (err, client)=> {
            var database = client.db("mydatabase");
            database.collection("Natural Preserve").find().toArray().then(users =>{
                console.log(users)
                res.render("naturalPreserve",{data:users});
            })
            
    })
    } catch (error) {
        console.log(error.message);
    }
}
const ArchaeologicalSite = async(req,res,next)=>{
    try {
        MongoClient.connect('mongodb://127.0.0.1:27017' ,{useNewUrlParser: true}, (err, client)=> {
            var database = client.db("mydatabase");
            database.collection("Archaeological Site").find().toArray().then(users =>{
                console.log(users)
                res.render("archaeologicalSite",{data:users});
            })
            
    })
    } catch (error) {
        console.log(error.message);
    }
}
const RestaurantAndCafe = async(req,res,next)=>{
    try {
        MongoClient.connect('mongodb://127.0.0.1:27017' ,{useNewUrlParser: true}, (err, client)=> {
            var database = client.db("mydatabase");
            database.collection("Restaurant & Cafe").find().toArray().then(users =>{
                console.log(users)
                res.render("restaurant&cafe",{data:users});
            })
            
    })
    } catch (error) {
        console.log(error.message);
    }
}
const TransportationCompany = async(req,res,next)=>{
    try {
        MongoClient.connect('mongodb://127.0.0.1:27017' ,{useNewUrlParser: true}, (err, client)=> {
            var database = client.db("mydatabase");
            database.collection("Transportation Company").find().toArray().then(users =>{
                console.log(users)
                res.render("transportationCompany",{data:users});
            })
            
    })
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