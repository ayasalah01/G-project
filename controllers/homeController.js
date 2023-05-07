const session = require("express-session");
const MongoClient = require('mongodb').MongoClient

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


module.exports ={
    getHome,
    getHomeAfterlogin,
    tourismCompany
    
}