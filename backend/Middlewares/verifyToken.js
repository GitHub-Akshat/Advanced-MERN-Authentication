const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if(!token)
    {
        return res.status(401).json({ success: false, message: "Unauthorised - NO token provided"});
    }
    try {
       const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
       if(!decodedToken) 
       {
        return res.status(401).json({ success: false, message: "Unauthorised - Invalid token"});
       }
       req.userID = decodedToken.userID;
       next();
    } 
    catch (error) {
        console.error(error)
        res.status(403).json({success:false, message : error.message});
    }
}

module.exports = { verifyToken };