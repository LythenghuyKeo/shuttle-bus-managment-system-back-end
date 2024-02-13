const asyncHandler=require("express-async-handler")
const User = require('../Schema/userSchema')
const BookingInfo= require('../Schema/bookingSchema')
const create_booking = asyncHandler (async(req,res)=>{
    const pickUpLocation = req.body.pickUpLocation
    const pickUpDateTime = new Date(req.body.pickUpDateTime)
    const expectPickUpTime = req.body.pickUpTime
    const destinationLocation= req.body.destinationLocation
    const destinationDateTime = new Date(req.body.destinationDateTime)
    const user_id = req.user_id
    const my_user = await User.findOne({_id:user_id})
    const my_booking = await BookingInfo.findOne({userId:user_id,pickUpDateTime:pickUpDateTime})
    
    if (my_user==null){
        res.send({message:"User is not exist!",status:false})
    }
    else if (my_user!=null){
        console.log(destinationLocation)
        try{
            const my_new_booking={
                userId:user_id,
                pickUpLocation:pickUpLocation,
                pickUpDateTime:new Date(pickUpDateTime.getFullYear(),pickUpDateTime.getMonth(),pickUpDateTime.getDate(),expectPickUpTime+7,0,0),
                destinationDateTime:new Date(destinationDateTime.getFullYear(),destinationDateTime.getMonth(),destinationDateTime.getDate()),
                destinationLocation:destinationLocation,
                status:"pending",
                driver:{
                    name:"",
                    carType:"",
                    carPlate:"",
                    phoneNumber:""
                }
            }
            if(destinationLocation != pickUpLocation && my_booking==null){
                console.log(my_new_booking)
                const booking = new BookingInfo(my_new_booking)
                await booking.save()
                await User.findOneAndUpdate({_id:user_id,remainingTickets:{$gt:0}},{$inc:{remainingTickets:-1,totalBooked:1}})
                res.send({message:"Successful Booked!",status:true})
            }else{
                res.send({message:"Location is the same",status:false})
            }
        }catch(error){
            res.send({message:error.message,status:false})
        }
    }

})
const get_booking = asyncHandler(async(req,res)=>{
    const user_id =req.user_id

    const my_booking = await BookingInfo.find({userId:user_id,pickUpDateTime:{$gte:new Date()}})
    if (my_booking==null){
        res.send({message:"User is not exist!",status:false})
    }
    else if (my_booking!=null){
        try{
            console.log(my_booking)
            res.send({message:my_booking,status:true})
        }catch(error){
            res.send({message:error.message,status:false})
        }
    }

})
const get_all_booking = asyncHandler(async(req,res)=>{
    const user_id =req.user_id
    const pickUpDate = req.body.pickUpDate
    const startDate = new Date(pickUpDate);
    const endDate = new Date(startDate); 
    endDate.setDate(endDate.getDate() + 1); 
    const my_user = await User.findOne({_id:req.user_id})
    const my_booking = await BookingInfo.find({  pickUpDateTime: {
        $gte: startDate, // Greater than or equal to pickUpDate
        $lt: endDate,   // Less than endDate (next day)
      }})
    if (my_booking==null){
        res.send({message:"User is not exist!",status:false})
    }
    else if ((my_user.role=='admin')&&(my_booking!=null)){
        try{
            console.log(my_booking)
            res.send({message:my_booking,status:true})
        }catch(error){
            res.send({message:error.message,status:false})
        }
    }

})
const cancel_booking = asyncHandler(async(req,res)=>{
    const bookingId = req.body.bookedId
    const user_id =req.user_id
    const my_booking = await BookingInfo.findOne({userId:user_id,_id:bookingId})
    if (my_booking !=null && my_booking.status =='pending'){
        const updateStatus = await BookingInfo.updateOne({_id:bookingId},{$set:{status:"cancelled"}})
        console.log(my_booking.status)
        if (updateStatus){
            res.send({message:`Booking number : ${my_booking._id} is cancelled`,status:true})
        }else{
            res.send({message:"Cant be cancel",status:false})
        }
    }else{
        res.send({message:"The ticket could not be cancelled !",status:false})
    }
})
const reject_booking = asyncHandler(async(req,res)=>{
    const bookingId = req.body.bookedId
    const my_user = await User.findOne({_id:req.user_id})
    const my_booking = await BookingInfo.findOne({_id:bookingId})
    if ((my_user.role=='admin') && (my_booking !=null) && (my_booking.status =='pending')){
        const updateStatus = await BookingInfo.updateOne({_id:bookingId},{$set:{status:"rejected"}})
        console.log(my_booking.status)
        if (updateStatus){
            res.send({message:`Reject successfully for booking number ${my_booking._id}`,status:true})
        }else{
            res.send({message:"Cant be reject",status:false})
        }
    }else{
        console.log((my_user.role=='admin') )
        res.send({message:"The ticket could not be cancel !",status:false})
    }
})
const accept_booking = asyncHandler(async(req,res)=>{
    const bookingId = req.body.bookedId
    const my_user = await User.findOne({_id:req.user_id})
    const my_booking = await BookingInfo.findOne({_id:bookingId})
    console.log(my_booking.status )
    if ((my_user.role=='admin') && (my_booking !=null) && (my_booking.status ==='pending')){
        const updateStatus = await BookingInfo.updateOne({_id:bookingId},{$set:{status:"approved"}})
        if (updateStatus){
            res.send({message:`Booking number : ${my_booking._id} is approved`,status:true})
        }else{
            res.send({message:"Cant be approve",status:false})
        }
    }else{
        res.send({message:"The ticket could not be approve !",status:false})
    }
})
const getUnAssignedDriver = asyncHandler(async(req,res)=>{
    const my_user = await User.findOne({_id:req.user_id});
    const pickUpDate = req.body.pickUpDate
    const startDate = new Date();
    // const endDate = new Date(startDate); 
    // endDate.setDate(endDate.getDate() + 1); 
    if (my_user.role=="admin"){

    
    try{
        const remainingPickUpDate = await BookingInfo.distinct('pickUpDateTime',{
            driver:{
                name:"",
                carType:"",
                carPlate:"",
                phoneNumber:""
            },
            pickUpDateTime:{$gte:startDate}
        })
        console.log(remainingPickUpDate)
        if (remainingPickUpDate){
            res.send({message:remainingPickUpDate,status:true})
        }else{
            res.send({message:"No data",status:false})
        }

    }catch(error){
        res.send({message:"No data",status:false})
    }
}else{
    res.send({message:"Not authorize",status:false})
}
})
const getAssignedDriver = asyncHandler(async(req,res)=>{
    const my_user = await User.findOne({_id:req.user_id});
    const pickUpDate = req.body.pickUpDate
    const startDate = new Date();
    // const endDate = new Date(startDate); 
    // endDate.setDate(endDate.getDate() + 1); 
    if (my_user.role=="admin"){

    
    try{
        const currentMonth = new Date().getMonth() + 1; // Get the current month (adjust if necessary for month indexing)
        const currentYear = new Date().getFullYear(); // Get the current year

        const startOfMonth = new Date(currentYear, currentMonth - 1, 1); // First day of the current month
        const endOfMonth = new Date(currentYear, currentMonth, 0); // Last day of the current month

        const distinctPickUpDatesWithDriverDetails = await BookingInfo.aggregate([
  // Match documents based on the criteria (current month and non-empty driver details)
  {
    $match: {
      pickUpDateTime: {
        $gte: startOfMonth,
        $lt: endOfMonth,
      },
      "driver.name": { $ne: "" },
      "driver.carType": { $ne: "" },
      "driver.carPlate": { $ne: "" },
      "driver.phoneNumber": { $ne: "" },
    },
  },
  // Group by pickUpDateTime and accumulate driver details
  {
    $group: {
      _id: "$pickUpDateTime",
      driver: {
        $addToSet: {
          name: "$driver.name",
          carType: "$driver.carType",
          carPlate: "$driver.carPlate",
          phoneNumber: "$driver.phoneNumber",
        },
      },
    },
  },
  // Optionally reshape the output if needed
  {
    $project: {
      _id: 0,
      pickUpDateTime: "$_id",
      driver: 1,
    },
  },
]);
        if (distinctPickUpDatesWithDriverDetails){
            res.send({message:distinctPickUpDatesWithDriverDetails,status:true})
        }else{
            res.send({message:"No data",status:false})
        }

    }catch(error){
        res.send({message:"No data",status:false})
    }
}else{
    res.send({message:"Not authorize",status:false})
}
})
const addDriver = asyncHandler(async(req,res)=>{
    const name = req.body.name;
    const carType = req.body.carType;
    const carPlate = req.body.carPlate;
    const phoneNumber = req.body.phoneNumber;
    const pickUpDate = req.body.pickUpDate;
    const my_user = await User.findOne({_id:req.user_id});
    const myBooking =await BookingInfo.findOne({pickUpDateTime:new Date(pickUpDate)})
    if (my_user.role=="admin"){

    
        try{
        
            const status = await BookingInfo.updateMany({pickUpDateTime:new Date(pickUpDate)},{driver:{name:name,carType:carType,carPlate:carPlate,phoneNumber:phoneNumber}})
            console.log(myBooking)
            if (status){
                res.send({message:"Driver is added",status:true})
            }else{
                res.send({message:"Added failed",status:false})
            }
    
        }catch(error){
            res.send({message:"No data",status:false})
        }
    }else{
        res.send({message:"Not authorize",status:false})
    }


})
const updateDriver = asyncHandler(async(req,res)=>{
    const name = req.body.name;
    const carType = req.body.carType;
    const carPlate = req.body.carPlate;
    const phoneNumber = req.body.phoneNumber;
    const pickUpDate = req.body.pickUpDate;
    const my_user = await User.findOne({_id:req.user_id});
    const myBooking =await BookingInfo.findOne({pickUpDateTime:new Date(pickUpDate)})
    if (my_user.role=="admin"){

    
        try{
        
            const status = await BookingInfo.updateMany({pickUpDateTime:new Date(pickUpDate)},{driver:{name:name,carType:carType,carPlate:carPlate,phoneNumber:phoneNumber}})
            console.log(myBooking)
            if (status){
                res.send({message:"Driver is updated!",status:true})
            }else{
                res.send({message:"Updates failed!",status:false})
            }
    
        }catch(error){
            res.send({message:"No data",status:false})
        }
    }else{
        res.send({message:"Not authorize",status:false})
    }


})
module.exports={updateDriver,addDriver,getAssignedDriver,getUnAssignedDriver,create_booking,get_booking,cancel_booking,accept_booking,reject_booking,get_all_booking}