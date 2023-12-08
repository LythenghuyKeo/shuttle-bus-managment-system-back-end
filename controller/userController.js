const jwt = require("jsonwebtoken")
const asyncHandler=require("express-async-handler")
const bcrypt = require("bcrypt")
const User = require("../Schema/userSchema")


const register = asyncHandler (async(req,res)=>{
    const email = req.body.email;
    const name=req.body.name;
    const department = req.body.department;
    const batch = req.body.batch;
    const gensalt = await bcrypt.genSalt(10)
    const password = req.body.password
    const hashpwd = await bcrypt.hash(String(password),gensalt)
    const my_user = await User.findOne({email:email})
    console.log(my_user)
    if (my_user!=null){
        res.send({message:"User already exist"})

    }
    else{
        const new_user={
            email:email,
            password:hashpwd,
            name:name,
            department:department,
            batch:parseInt(batch)
        
        }
        try{
            const user = new User(new_user)
            const status = await user.save();
            console.log(status);
            res.status(201).json({message:'Successfully Register',status:true})
        } catch(error){
            res.status(201).json({message:error.message,status:false})
        }
        
       
    }
})
const login = asyncHandler (async(req,res)=>{
    const email = req.body.email
    const pwd   = req.body.password
    const my_user = await User.findOne({email:email})
    
    if (my_user==null){
        res.send({message:"User is not exist!",status:false})
    }
    else if ((my_user!=null)&&(my_user.email==email)&&(bcrypt.compare(pwd,my_user.password))){
        // await my_user.({logged_in:true},{ where:{
        //     email:email}
        // })
        await User.updateOne({email:my_user.email},{logged_in:true})
        const my_token = await generatetoken(my_user._id)
        res.send({message:"Successful Logged !",token:my_token,logged_in:my_user.logged_in,status:true,role:my_user.role})
    }
})
const logout = asyncHandler(async(req,res)=>{
        const _id = req.user_id
        const my_user = await User.findOne({_id:_id})
        console.log(_id)
        req.headers.authorization=""
        if (my_user!=null && _id==my_user._id){
            const updateStatus= await User.updateOne({_id:_id},{logged_in:false})
            if (updateStatus!=null){
                res.send({message:"Log out successfully",status:true})
            }else{
                res.send({message:"Log out failed ",status:false})
            }
        }else{
            res.send({message:"Log out failed ",status:false})
        }
     
    

    });

const getProfile = asyncHandler(async(req,res)=>{
    const my_user = await User.findOne({_id:req.user_id},'-password')
    console.log(my_user)
    if (my_user!=null){
        res.status(200).json({user:my_user,status:true})
    }
})

const updateprofile = asyncHandler(async(req,res)=>{
    const user_id =req.user_id
    const name = req.body.name
    const image = req.body.image;
   
    const my_profile = await User.findOne({_id:user_id},'-password')
    if (my_profile==null){
        res.status(200).send({'message':"Profile is not found!",'status':false})
    }else if (my_profile!=null && user_id==my_profile._id && name!=null){
        const updateStatus= await User.updateOne({_id:user_id},{name:name})
        if (updateStatus){
            res.send({message:"Updated successfully",status:true})
        }else{
            res.send({message:"Updated failed",status:false})
        }
    }
    // if (my_profile==null){
    //     res.status(200).send({'message':"Profile is not found!"})
    // }else if (user_id!=my_profile.UserId){
    //     res.status(200).send({'message':"Not Authorized!"})
    // }
    // else if (my_profile!=null && user_id==my_profile.UserId){
    //     await Profile.update(
    //         {name:name,
    //          email:email,
    //          address:address,
    //          phoneNumber:phoneNumber
    //      },{where:{
    //         id:id
    //      }}
    //     ).then(data=>{
    //         res.status(200).json({'message':"Profile update successfully"})
    //     }).catch(err=>{
    //         res.status(200).json({'message':err.mesaage||"some error occured while adding"})
    //     })
    // }
})
const generatetoken =(id)=>{
    return jwt.sign({id},process.env.JWT_SECRETKEY,{
        expiresIn:'1h'
    })
}
const generateexpiretoken =(id)=>{
    return jwt.sign({id}," ",{
        expiresIn:'0h'
    })
}

// module.exports={
//     register,login,logout,updateprofile,getProfile
// }

module.exports={
    register,login,getProfile,logout,updateprofile
}