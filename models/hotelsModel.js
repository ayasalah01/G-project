const mongoose = require("mongoose");

const hotelSchema = mongoose.Schema({
    postDetails:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    }
});

module.exports= mongoose.model("Hotel",hotelSchema);