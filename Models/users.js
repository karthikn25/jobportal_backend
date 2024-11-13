const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');



const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true

    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    avatar:{
        type:String
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength:5
     
    },
    position:{
        type:String,
    
    },
    experiance:{
      type:String
    },
    location:{
        type:String,
        
    },
  
})

const generateToken = (id)=>{
   return jwt.sign({id},process.env.secretKey)
}

const User = mongoose.model("user",userSchema);



module.exports = {User,generateToken}