const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    serviceName:{
        type:String,
        ref:"serviceProvider"
    },
    message:{
        type:String,
        required:true  
    }
});
module.exports = mongoose.model("message",messageSchema);

