const express = require('express')
const app = express()
require('dotenv').config({path:"./env"})
const cloudinary = require('cloudinary').v2
const fs = require('fs')


cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.SECRET_KEY
});


const uploadOnCloudinary = async (localFilePath)=>{
    try {
        if (!localFilePath) return 'no file ...'
        const response = await cloudinary.uploader.upload(localFilePath,{resource_type:'auto'})

        console.log('file uploaded successfully',response.url);
        fs.unlinkSync(localFilePath)
        return response
        

    } catch (error) {
        fs.unlinkSync(localFilePath)
        return 'error ... i am here at cath of uploadOnCloudinary'
    }
}


module.exports = uploadOnCloudinary