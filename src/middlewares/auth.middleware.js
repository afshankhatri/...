const User = require("../models/user.model")
const apiError = require("../utils/apiError")
const asyncHandler = require("../utils/asyncHandler")
const jwt = require('jsonwebtoken')
const logoutUser = require('../controllers/user.controller')
require('dotenv').config()


const verifyJWt = asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ",'')
        console.log('Token:', token);
        if (!token) {
            throw new apiError('unauthorized request',401)
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        console.log('Decoded Token:', decodedToken);

        const user = await User.findById(decodedToken?._id).select('-password -refreshToken')
    
        if (!user) {
            console.log('laaaaaaalaa');
            
            throw new apiError('invalid access token',401)
        }
        
        req.user = user
        next()
    } catch (error) {
        console.log('laaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

        throw new apiError(`invalid access token ${error?.message}`,401)
    }
})

module.exports = verifyJWt