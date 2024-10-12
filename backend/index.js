require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();

const authRoutes = require("./Routes/auth");
const db = require("./db/connectDB");


const PORT = process.env.PORT || 5000 ;

app.use(cors({ origin:"http://localhost:5173", credentials: true}))
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth" , authRoutes);

if(process.env.NODE_ENV === "production")
{
    app.use(express.static(path.join(__dirname,'..', "frontend/dist")));
    app.get("*", (_, res) => {
        res.sendFile(path.resolve(__dirname,'..', "frontend", "dist", "index.html"));
    });
}

app.listen(PORT, ()=>{
    console.log("Server started at port" , PORT);
})