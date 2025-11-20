import Message from "../models/Message.js";
import User from "../models/User.js";
import 'dotenv/config';
import { getUserSocketId } from "../lib/socket.js";
import cloudinary from "../lib/cloudinary.js";
import { io } from "../lib/socket.js";


export const getContacts = async(req,res)=>{

    try{
         const loggedUser=req.user._id;

    const contacts = await User.find({_id:{$ne:loggedUser}})
    res.status(200).json(contacts)

        
    } catch (error) {
        console.log("Error in getting contacts")
      res.status(500).json({message: error.message})

        
    }

}



export const messagesbyUserId = async(req,res)=>{
       try{
         const loggedUser=req.user._id;
         const {id}= req.params

         const messages = await Message.find({
            $or:[{senderId:loggedUser,receiverId: id},
                {senderId:id,receiverId: loggedUser}]
         })

         res.status(200).json(messages)



        
    } catch (error) {
        console.log("Error in getting Messages ")
      res.status(500).json({message: error.message})

        
    }

}


export const sendMessage = async(req,res)=>{

    try{

         const loggedUser=req.user._id;
         const {id}= req.params

        const {text,image} =req.body

        let imageUrl;

        if(image){
            const uploadres= await cloudinary.uploader.upload(image)
            imageUrl =uploadres.secure_url
        }

        
        
    
        const newMessage =await Message.create({
            senderId:loggedUser,
            receiverId:id,
            text,
            image:imageUrl
        })
    

               const receiver = getUserSocketId(newMessage.receiverId)
               if(receiver){
                               io.to(receiver).emit("newMessage",newMessage)

               }



        
     

    res.status(200).json(newMessage)

        
    } catch (error) {
        console.log("Error in sending messages")
      res.status(500).json({message: error.message})
        
    }

}




export const getChatpartners = async(req,res)=>{
    try{
     const loggedUser=req.user._id;

    const messages = await Message.find({ $or :[
        {senderId: loggedUser},{receiverId: loggedUser}
    ]})

const filteredIds = [...new Set(
  messages.map((msg) => 
    msg.senderId.toString() === loggedUser.toString()
      ? msg.receiverId.toString()
      : msg.senderId.toString()
  )
)];

    const chatPartners = await User.find({_id:{$in: filteredIds}})

    res.status(200).json({chatPartners})


    } catch (error) {
        console.log("Error in getting contacts")
       res.status(500).json({message: error.message})

        
    }

}


