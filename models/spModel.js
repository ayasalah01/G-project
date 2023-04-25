const mongoose = require("mongoose");


const serviceProviderSchema = mongoose.Schema({
    name:{
        type:String,
        default:""
    },
    serviceName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:[true,'email is required'],
    },
    Address:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:[true,'password is required']
    },
    category:{
        type:String,
        required:true,
        enum:["Hotel","Cinema","Bazaar","Resort & Village","Natural Preserves","Tourism Company","Archaeological Sites","Restaurant & Cafe","Transportation Company"]
    },
    phoneNumber:{
        type:String,
    },
    is_varified:{
        type:Number,
        default:0
    },
    token:{
        type:String,
        default:""
    }

});
module.exports = mongoose.model("serviceProvider",serviceProviderSchema);