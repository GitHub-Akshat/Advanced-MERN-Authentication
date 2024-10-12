const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
    fullname : {
        type : String,
        unique : true,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    lastLogin : {
        type : Date,
        default : Date.now()
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    resetPasswordToken : String,
    resetPasswordTokenExpiredAt : Date,
    VerificationToken : String,
    VerificationTokenExpiredAt : Date,
},
{
    timestamps : true
});

const User = mongoose.model("User", userschema);

module.exports = (User);