
import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cloudinary from "../lib/cloudinary.js";
import 'dotenv/config';
import { sendWelcomeEmail } from "./emails/emailHandler.js";

export const signup =async (req,res)=>{

    try {
        const{fullname,email,password}=req.body

        if(!fullname || !email || !password ){

            return res.send("Please Enter all the required details")
        }

        if(password.length <6){
            return res.send("Password should be atleast 6 characters")
        }

        const user = await User.findOne({email})

        if (user)return res.status(400).json({message:"User already exists"})
      const salt =await bcrypt.genSalt(10)
        const hashedpass= await bcrypt.hash(password,salt)


            const newUser =await User.create({
                fullname,email,password: hashedpass


            });

            const token =jwt.sign({id:newUser._id},process.env.JWT_SECRET,{expiresIn:"7d"});

            res.cookie("jwt",token,{maxAge: 7*24*60*60*1000,
                httpOnly:true,
                sameSite:"none",
                secure: true,
                // secure: process.env.NODE_ENV === "production"

                
            } )

            // try {
            //     await sendWelcomeEmail(newUser.email,newUser.fullname,process.env.CLIENT_URL)

                
            // } catch (error) {
            //     res.status(500).send("Can't send Email")
            // }
  
return res.status(200).json({ 
    _id: newUser._id,
    fullname: newUser.fullname,
    email: newUser.email,
    pp: newUser.pp,

})

        
    } catch (error) {
       console.log()
       res.status(500).send({message: error.message})

    }

}




export const login = async (req,res)=>{

    try {
        const {email,password}=req.body
        if(!email || !password)return res.status(404).send("Enter both password and email")

            const user =await User.findOne({email})
            if(!user)return res.status(404).send("No account found with this email")
                
           const isPass= await bcrypt.compare(password,user.password)
           if(!isPass)return res.status(401).send("Invalid Password")

            const token =jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});


            
            res.cookie("jwt",token,{maxAge: 7*24*60*60*1000,
                httpOnly:true,
                sameSite:"none",
                secure: true,
            //  secure: process.env.NODE_ENV === "production",
                
            } )

            
   res.status(200).json({
  _id: user._id,
  fullname: user.fullname,
  email: user.email,
  pp: user.pp
});


        
        
    } catch (error) {
       console.log()
       res.status(500).send({message: error.message})

    }

}


export const logout = async(_,res)=>{
     res.cookie("jwt","", {maxAge:0})
      res.status(200).json({message:"Logged out Successfully"}) 

}

export const Updatepp =async(req,res)=>{

    try {

        const profile = req.body.pp
    if(!profile) return res.status(404).send("Profilepic is required")

    const id =req.user._id 
    const cloudinaryRes = await cloudinary.uploader.upload(profile)

    const updatedUser =await User.findByIdAndUpdate(id, 
        {pp:cloudinaryRes.secure_url},
        {new:true}
    )

    res.status(200).json(updatedUser);

        
    } catch (error) {
        console.error("Error updating profile")
        res.status(401).send("Error updating..")
    }
    


}

