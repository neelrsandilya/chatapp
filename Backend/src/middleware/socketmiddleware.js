import jwt from 'jsonwebtoken'
import User from "../models/User.js"
import 'dotenv/config';
 


export const socketmiddleware= async(socket,next)=>{
    try {

        const token = socket.handshake.headers.cookie
        ?.split(";")
  .find((row) => row.trim().startsWith("jwt="))
  ?.split("=")[1];

if(!token){
          return next(new Error("Authentication error: No token"));

}

const decoded =jwt.verify(token,process.env.JWT_SECRET)

if(!decoded){
      return next(new Error("Authentication error: Invalid token"));
}
        
const user =await User.findById(decoded.id)

  if (!user) {
      console.log("❌ Socket auth failed: User not found");
      return next(new Error("Authentication error: User not found"));
    }

socket.user= user;
socket.userId=user._id;

next()

    } catch (error) {
         console.error("❌ Socket middleware error:", error.message);
    next(new Error("Unauthorized"));
        
    }

}