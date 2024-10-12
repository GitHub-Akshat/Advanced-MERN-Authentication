const express = require("express");
const routes = express.Router();
const { Signup , Signin , Logout , verifyEmail, forgetPassword, resetPassword, checkAuth } = require("../controllers/auth");
const { verifyToken } = require("../Middlewares/verifyToken");

routes.get("/check-auth" , verifyToken, checkAuth);

routes.post("/signup" , Signup );

routes.post("/signin" , Signin);

routes.post("/logout" , Logout);

routes.post("/verify-email" , verifyEmail);

routes.post("/forgot-password" , forgetPassword);

routes.post("/reset-password/:token" , resetPassword);

module.exports = routes;
