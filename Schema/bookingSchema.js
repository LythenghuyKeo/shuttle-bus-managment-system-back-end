const mongoose = require('mongoose');
const {driverDetail}=require('./driverSchema')
const bookingInfo = new mongoose.Schema({
    userId:{
      type:Object,
      required:true
    },
    pickUpLocation:{
        type:String,
        required:true
    },
    pickUpDateTime:{
        type:Date,
        required:true
    },
    destinationLocation:{
        type:String,
        requrired:true
    },
    destinationDateTime:{
        type:Date,
        requrired:true
    },
    status:{
        type:String,
        deafult:'pending',
        enum:['pending','approved','cancelled','rejected']
    },
    driver:{
        type:Object
    }


})
const BookingInfo = mongoose.model('BookingInfo',bookingInfo);
module.exports =BookingInfo;