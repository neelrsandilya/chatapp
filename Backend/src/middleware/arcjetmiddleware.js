import { aj } from "../lib/arcjet.js"
import {isSpoofedBot} from "@arcjet/inspect"

export const arcjetProtection= async (req,res,next) => { 

    try {
        const decision = await aj.protect(req)
     if(decision.isDenied()){

        if(decision.reason.isRateLimit()){
            return res.status(429).send("Requests limit exceeded")
        }else if(decision.reason.isBot()){ 
            return res.status(429).send("Bot detected")

        }else{
             return res.status(429).send("Security policy violated")
        }

    }
     if(decision.results.some(isSpoofedBot)){
        return res.status(429).send("Spoofed Bot detected")

    }
   next()

   
        
    } catch (error) {
        return res.status(429).send("Arcjet Protection error")    }
     next()

 }