import express from "express";
import connectDB from "./config/dbConfig.js";
import dotenv from "dotenv";

const app=express()
const port=5000
dotenv.config()

app.use(express.json())
app.use(express.urlencoded())
connectDB()



 app.listen(port,()=>console.log("Server is running....."))
