const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:[true,'email is required'],
        unique: true
    },
    phoneNumber:{
        type:String,
        required:[true,'phone number is required'],
        unique: true
        
    },
    password:{
        type:String,
        required:[true,'password is required']
    },
    is_admin:{
        type:Number,
        required:true
    },
    is_varified:{
        type:Number,
        default:0
    }
    
});
module.exports= mongoose.model("user",userSchema);