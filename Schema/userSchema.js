const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        match:/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        requrired:true
    },
    role:{
        type:String,
        default:"user"
    },
    remainingTickets:{
        type:Number,
        default:45,
        min:0,
  
    },
    totalBooked:{
        type:Number,
        default:0,
    },
    department:{
        type:String,
        requrire:true
    },
    batch:{
        type:Number,
        required:true
    },
    logged_in:{
        type:Boolean,
        default:false
    },
 

})
const User = mongoose.model('User',userSchema);
module.exports = User;