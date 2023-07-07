const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:[true,'username is required'],
        unique: true
    },
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
    location:{
        type:String,
        default:"Fayoum"
    },
    is_admin:{
        type:Number,
        required:true
    },
    is_varified:{
        type:Number,
        default:0
    },
    token:{
        type:String,
        default:""
    },
    is_online:{
        type:String,
        default:"0"
    }
},
{timestamps:true}
);
module.exports= mongoose.model("user",userSchema);