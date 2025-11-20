
import mongoose from "mongoose"
import User from "../models/User.js"
import 'dotenv/config';
import jwt from "jsonwebtoken"


export const protectRoute = async(req,res,next)=>{

    try {const token =req.cookies.jwt
if(!token) return res.status(401).json({message:"Authorization failed, Login again"})

    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    if(!decoded) return res.status(401).json({message:"Invalid Token"})

const user = await User.findById(decoded.id)

 if(!user) return res.status(401).json({message:"Please login first"})

    if (!user) {
  res.clearCookie("jwt");
  return res.status(401).json({ message: "Session expired. Please log in again." });
}


req.user= user

next()
        
    } catch (error) {
        res.status(500).send("Invalid or expired token")
    }


}