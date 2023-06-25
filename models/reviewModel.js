
const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    rate:{
        type:Number,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    sp_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"serviceProvider",
        required:true
    },
    userId:{
        type:String,
        required:[true,'user id is required'],
        ref:"user"
    },
},
{timestamps:true}
);

module.exports= mongoose.model("review",reviewSchema);
