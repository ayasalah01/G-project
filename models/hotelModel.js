const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    serviceName:{
        type:String,
        ref:"serviceProvider"
    },
    postDetails:{
        type:String,
        
    },
    image:{
        type:String,
        required:true
    },
    spId:{
        type:String
        
    }
});

module.exports= mongoose.model("hotel",postSchema);