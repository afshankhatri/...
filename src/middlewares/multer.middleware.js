const uploadOnCloudinary = require('../utils/cloudinary')
const mongoose = require("mongoose")
const multer = require('multer')

const storage = multer.diskStorage({
    destination:function(req,file,cb){
         cb(null,'./../justDoIt2/public/tempImageStore')
        //cb(null,'./../project_placement/public/tempImageStore')//path set kar le accordingly
        // cb(null,'./../justDoIt2/public/tempImageStore')
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})

const upload = multer({storage})

module.exports = upload