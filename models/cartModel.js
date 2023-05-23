const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"serviceProvider"
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
    
},
{timestamps:true}
);
module.exports= mongoose.model("cart",cartSchema);