const mongoose = require('mongoose');
const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_DB_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log('connected to mongodb')
    }catch (error){
        console.error('Eoor connect to MONGO DB ',error)
    }
};
module.exports=connectDB;