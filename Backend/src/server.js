import express from 'express'
import authroute from "./routes/authroute.js"
import messageroute from "./routes/messageroute.js"
import { connectDB } from './lib/db.js'
import cookieParser from "cookie-parser";
import cors from "cors";
import { app,server } from './lib/socket.js';

import 'dotenv/config';


app.use(express.json({limit:"5mb"}));

app.use(cors({
  origin: "https://chatapp-front-b7la.onrender.com",
  credentials: true,
}));

const PORT =process.env.PORT;

app.use(cookieParser())


app.use('/api/auth',authroute)
app.use('/api/message',messageroute)

app.get('/',async (req,res) => { 
    res.send("hii")
 })



server.listen(PORT, () => { 
    try {
           console.log(`Server started successfully at PORT ${PORT}` )
    connectDB()
        
    } catch (error) {
        console.log("Cannot connect to DB")
        
    }
 
 })

