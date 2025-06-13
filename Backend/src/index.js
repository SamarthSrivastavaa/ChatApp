import express from "express"
import dotenv from "dotenv"    //for the process.env and all
import { connectDB } from "./lib/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"


dotenv.config()
const app=express()
const port=process.env.PORT || 9001

app.use(cookieParser());  //lets us parse the cookie to extract value from the cookie  //this should COME BEFORE ANY ROUTE FOR THE COOKIE TO NOT BE UNDEFINED
app.use(cors(
    {
    origin:"http://localhost:5173",
    credentials:true
    }
))
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"

// app.use(express.json())  //allows user to extract json data from the body  //before
app.use(express.json({ limit: '5mb' })); // Increase to 5MB or more  //after
app.use(express.urlencoded({ limit: '5mb', extended: true })); //did because while uploading profile pic,payload too large error was coming
app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);  //message->messages while writing frontend

app.listen(port,()=>{
    console.log(`Server is listening at port ${port}...`);
    connectDB()
})