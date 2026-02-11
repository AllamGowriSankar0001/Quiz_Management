const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const connectDB = require('./Config/ConnectDB');
const createAdmin = require('./Scripts/AdminCreate');
const AdminRoutes = require("./Routes/AdminRoutes");
const UserRoutes = require("./Routes/UserRoutes")
const app = express();
const PORT = process.env.PORT;

connectDB();


app.use(cors());
app.use(express.json());

app.get("/check",(req,res)=>{
    res.status(200).json({message:"The Backend is running perfectly"})
})
app.use("/admin",AdminRoutes);
app.use("/user",UserRoutes);

app.listen(PORT,()=>{
  console.log(`Server running at http://localhost:${PORT}`);
})