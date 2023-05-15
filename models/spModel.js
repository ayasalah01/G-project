const mongoose = require("mongoose");


const serviceProviderSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique: true
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
        enum:["Hotel","Cinema","Bazaar","Resort & Village","Natural Preserve","Tourism Company","Archaeological Site","Restaurant & Cafe","Transportation Company"]
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
    },
    User_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"

    }


});
module.exports = mongoose.model("serviceProvider",serviceProviderSchema);