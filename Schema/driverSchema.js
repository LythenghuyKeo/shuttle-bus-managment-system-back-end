const mongoose = require('mongoose');
const driverDetail = new mongoose.Schema({
    driverName:{
        type:String,
        require:true,
        default:"MR. ABC002"
    },
    carModel:{
        type:String,
        require:true,
        default:"SUV"
    },
    maxSeat:{
        type:Number,
        require:true,
        default:15
    },
    phoneNumber:{
        type:String,
        require:true,
        default:"+855 000 111 222"
    },
    

})
const Driver = mongoose.model('Driver',driverDetail);
module.exports = Driver;