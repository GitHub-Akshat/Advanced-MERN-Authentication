const crypto = require("crypto")
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const generateTokenAndSetCookies = require("../utilities/generateTokenAndSetCookies");
const { sendVerificationEmail , sendWelcomeEmail, sendForgetPassword, sendResetSuccessEmail }  = require("../Mailtrap/emails");

const Signup = async (req,res) =>
{
    const{ fullname, email, password } = req.body;
    try{
        if(!fullname || !email || !password)
        {
            console.log(fullname, email, password);
            throw new Error("All fields are required");
        }
        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists)
        {
            return res.status(400).json({ success:false, message:"User Already Exist"});
        }

        const hashedPassword = await bcrypt.hash(password,12);
        const VerificationToken = Math.floor(100000 + Math.random() * 900000).toString();


        const newuser = new User({
            fullname,
            email,
            password : hashedPassword,
            VerificationToken,
            VerificationTokenExpiredAt : Date.now() + 24 * 60 * 60 * 1000
        })

        await newuser.save();

        generateTokenAndSetCookies(res, newuser._id);
        await sendVerificationEmail(newuser.email, newuser.VerificationToken );

        res.status(201).json({success: true, message : "User created Successfully",  user:{ ...newuser._doc, password : undefined}
        })
    }
    catch(error){
        console.error(error);
        res.status(400).json({success:false, message : error.message});
    }
}

const verifyEmail = async (req, res) => {
    const {code} = req.body;
    try {
        const user = await User.findOne({
            VerificationToken : code,
            VerificationTokenExpiredAt : { $gt : Date.now()}
        })
        if(!user)
        {
            return res.status(400).json({success : false, message : "Invalid or expired verification code"})
        }

        user.isVerified = true;
        user.VerificationToken = undefined;
        user.VerificationTokenExpiredAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.fullname);

        res.status(201).json({ success: true, message: "Welcome email sent successfully", user:{ ...user._doc, password : undefined} })
    } 
    catch(error){
        console.error(error)
        res.status(400).json({success:false, message : error.message});
    }
}

const Signin = async (req,res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});
        if(!user)
        {
            return res.status(400).json({success: false, message: "User not found"})
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword)
        {
            return res.status(400).json({ success: false, message: "Invalid credentials"});
        }

        generateTokenAndSetCookies(res,user._id);

        user.lastLogin = new Date;
        await user.save();

        res.status(201).json({ success: true, message: "Logged in successfully", user :{ ...user._doc, password : undefined} });
    } 
    catch (error) {
        console.error(error)
        res.status(400).json({success:false, message : error.message});
    }
}

const Logout = async (req,res) => {
   res.clearCookie("token");
   res.status(200).json({ success:true, message:"Logged Out succesfully"});
}

const forgetPassword = async (req,res) => {
    const{ email } = req.body;
    try {
        const user = await User.findOne({email});
        if(!user)
        {
            return res.status(400).json({ success: false, message: "Email not found"});
        }
        
        const resetPassToken = crypto.randomBytes(25).toString("hex");
        const resetPassTokenExpiresAt = Date.now() + 1*60*60*1000;

        user.resetPasswordToken =  resetPassToken;
        user.resetPasswordTokenExpiredAt = resetPassTokenExpiresAt;

        await user.save();
       
        await sendForgetPassword(user.email, `${process.env.CLIENT_URL}/reset-password/${resetPassToken}`);

        res.status(200).json({ success:true, message:"Password Reset Requested at your email"});
    } 
    catch (error) {
        console.error(error)
        res.status(400).json({success:false, message : error.message});
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({ resetPasswordToken: token , resetPasswordTokenExpiredAt: {$gt : Date.now()}});

        if(!user) 
        {
            return res.status(400).json({success:false, message : "Invalid token"});

        }

        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiredAt = undefined;
        await user.save();
        sendResetSuccessEmail(user.email);
        res.status(200).json({ success: true, message: "Password changed successfully"});
    } 
    catch (error) {
        console.error(error)
        res.status(400).json({success:false, message : error.message});
    }
}

const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userID);
        if(!user)
        {
            return res.status(400).json({ success: false, message: "User not Found"});
        }

        res.status(201).json({ success: true, user:{ ...user._doc, password: undefined}});
    } 
    catch (error) {
        console.error(error)
        res.status(400).json({success:false, message : error.message});
    }
}

module.exports = {
    Signup,
    Signin,
    Logout,
    verifyEmail,
    forgetPassword,
    resetPassword, 
    checkAuth
};