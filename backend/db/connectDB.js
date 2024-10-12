const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("DB Connected"))
.catch(err=>console.log("DB Connection Error:", err));

