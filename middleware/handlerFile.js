const jwt = require("jsonwebtoken")
const User = require('../Schema/userSchema')
const asyncHandler=require("express-async-handler")

const protect = asyncHandler(async(req,res,next)=>{
  let token 
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    try{
        //Get token from header
        token = req.headers.authorization.split(" ")[1]
        const decoded =await jwt.verify(token,process.env.JWT_SECRETKEY)
        req.user_id=decoded.id
        const my_user = await User.findOne({_id:decoded.id},'-password')
        if (my_user==null || my_user.logged_in==false){
            await User.updateOne({_id:decoded.id},{logged_in:false})
            res.send({status:false,logged_in:false})
        } else if (my_user!=null && my_user.logged_in==true){
            // res.send({status:true,logged_in:true})
            next()
        }
    }catch (error){ 
        res.send({status:false,logged_in:false,message:error.message,token:token})

    }
  }
  if (!token){
    res.status(401)
    throw new Error("Not Authorized")
  }
})
module.exports={protect,asyncHandler}