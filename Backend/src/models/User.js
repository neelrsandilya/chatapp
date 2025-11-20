import mongoose from 'mongoose'

const UserSchema =new mongoose.Schema({
    fullname :{type: String,required:true},

    email: {type: String,required: true,unique:true}, 

    phone: {type: String},

    password:{type:String,required:true,minlength:8},

    pp:{type:String, default:""},

}, 
{timestamps:true})

const User =mongoose.model("User",UserSchema)

export default User