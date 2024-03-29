const express = require('express')
const {get_all_location,create_location,delete_all_location,delete_location,update_location}=require('../controller/locationController')
const {login} =require('../controller/userController')
const {protect} = require('../middleware/handlerFile')
const {updateDriver,addDriver,getAssignedDriver,reject_booking,accept_booking,get_all_booking,getUnAssignedDriver}=require('../controller/bookingController')
const router = express.Router()
router.get("/api/admin/get_all_location",protect,get_all_location)
router.post("/api/admin/create_location",protect,create_location)
router.post("/api/admin/get_all_booking",protect,get_all_booking)
router.put("/api/admin/reject_booking",protect,reject_booking)
router.put("/api/admin/accept_booking",protect,accept_booking)
router.get("/api/admin/getUnAssignedDriver",protect,getUnAssignedDriver)
router.delete("/api/admin/delete_all_location",protect,delete_all_location)
router.post("/api/admin/delete_location",protect,delete_location)
router.put("/api/admin/update_location",protect,update_location)
router.get("/api/admin/getAssignedDriver",protect,getAssignedDriver)
router.post("/api/admin/addDriver",protect,addDriver)
router.put("/api/admin/updateDriver",protect,updateDriver)
module.exports =router