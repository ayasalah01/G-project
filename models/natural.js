const mongoose = require("mongoose");

const naturalSchema = mongoose.Schema({
    serviceName:{
        type:String,
    },
    offerTitle:{
        type:String,
    },
    image:{
        type:String,
    },
    postDetails:{
        type:String,
    },
    available_day:{
        type:String,
    },
    available_time:{
        type:String,
    },
    category:{
        type:String,
    }
    
},
{timestamps:true}
);

module.exports= mongoose.model("natural",naturalSchema);