const mongoose = require("mongoose");

const naturalSchema = mongoose.Schema({
    image:{
        type:String,
    },
    postDetails:{
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