import mongoose from 'mongoose'
import 'dotenv/config';


export const connectDB =async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database connected successfully host: ${conn.connection.host}`)
        
    } catch (error) {

     console.log("Cannot connect to DB")

        process.exit(1)
    }
    
}


 