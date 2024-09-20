
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required : true,
    },
    email:{
        type:String,
        required : true,
        unique : true,
    },
    pfpImage:{
        type:String,
        default:"/images/profileDefault.jpeg"
    },
    password:{
        type:String,
        required : true,
    },
    isOnline:{
        type:String,
        default : '0'
    },
},{timestamps : true}
);

module.exports = mongoose.model("User",userSchema);