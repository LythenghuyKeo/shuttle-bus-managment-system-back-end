const Location = require('../Schema/locationSchema')
const User = require('../Schema/userSchema')
const asyncHandler=require("express-async-handler")
const create_location = asyncHandler(async(req,res)=>{
    const my_user = await User.findOne({_id:req.user_id})
    const location_name = req.body.location_name
    const duration = req.body.duration
    const my_location=await Location.findOne({locationName:location_name,duration:duration})
    if ((my_user.role=='admin')&&(location_name!=null)&&(my_location==null)){
        const inputLocation = Location({location_name:location_name})
       try{
        await inputLocation.save()
        
        res.status(201).json({message:'Location Added',status:true})
       
    }catch (error){
        res.status(201).json({message:error.message,status:false})
         
    }
    }
})
const delete_all_location = asyncHandler(async(req,res)=>{
    await Location.deleteMany({})
    res.status(201).json({message:'Location Deleted',status:true})
})
const update_location = asyncHandler(async(req,res)=>{
    const my_user = await User.findOne({_id:req.user_id})
    const new_location_name = req.body.locationName
    const location_id = req.body.id
    const my_location=await Location.findOne({_id:location_id})
    if ((my_user.role=='admin')&&(location_id!=null)&&(my_location!=null)){
       try{
        const status=await Location.updateOne({_id:location_id},{location_name:new_location_name})  
        res.status(201).json({message:'Location Updated',status:true})
       
    }catch (error){
        res.status(201).json({message:error.message,status:false})
         
    }
    }
})
const delete_location = asyncHandler(async(req,res)=>{
    const my_user = await User.findOne({_id:req.user_id})
    const location_id = req.body.locationId
    const my_location=await Location.findOne({_id:location_id})
    if ((my_user.role=='admin')&&(location_id!=null)&&(my_location!=null)){
       try{
        await Location.deleteOne({_id:location_id})
        
        res.status(201).json({message:'Location Deleted',status:true})
       
    }catch (error){
        res.status(201).json({message:error.message,status:false})
         
    }
    }
})
const get_all_location = asyncHandler(async(req,res)=>{
    const my_location=await Location.find({})
    console.log(my_location)
    res.status(201).json({message:my_location,status:true}) 
})
module.exports={
    get_all_location,create_location,update_location,delete_location,delete_all_location
}