
const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    service:{
        type:String,
        ref:"service"
    },
    qauntity:{
        type:Number,
        required:true
        // default:0
    },
    price:{
        type:String,
        ref:"service"
    },
    category:{
        type:String,
        ref:"service"
    },
    userId:{
        type:String,
        required:[true,'user id is required'],
        ref:"user"
    }
    
},
{timestamps:true}
);

module.exports= mongoose.model("order",orderSchema);
