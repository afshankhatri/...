// const User = require("../models/user.model")
// const apiError = require("../utils/apiError")
// const asyncHandler = require("../utils/asyncHandler")
// const jwt = require('jsonwebtoken')
// const logoutUser = require('../controllers/user.controller')
// const Admin = require("../models/admin.model")
// require('dotenv').config()


// const verifyJWt = asyncHandler(async(req,res,next)=>{
//     try {
//         const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ",'')
//         console.log('Token:', token);
//         if (!token) {
//             throw new apiError('unauthorized request',401)
//         }
    
//         // console.log(process.env.ACCESS_TOKEN_SECRET);
        
//         const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

//         console.log('Decoded Token:', decodedToken);

//         const user = await User.findById(decodedToken?._id).select('-password -refreshToken')
    
//         if (!user) {
//             throw new apiError('invalid access token',401)
//         }
        
//         req.user = user
//         next()
//     } catch (error) {
//         console.log('laaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

//         throw new apiError(`invalid access token ${error?.message}`,401)
//     }
// })

// module.exports = verifyJWt

// const admin = await Admin.findById(decodedToken?._id).select('-password -refreshToken')
    
// if (!admin) {
//     throw new apiError('invalid access token',401)
// }

// req.admin = admin






const User = require("../models/user.model")
const apiError = require("../utils/apiError")
const asyncHandler = require("../utils/asyncHandler")
const jwt = require('jsonwebtoken')
const logoutUser = require('../controllers/user.controller')
const Admin = require("../models/admin.model")
require('dotenv').config()


const verifyJWt = asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ",'')
        console.log('Token:', token);
        if (!token) {
            throw new apiError('unauthorized request',401)
        }
    
        // console.log(process.env.ACCESS_TOKEN_SECRET);
        
        const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        console.log('Decoded Token:', decodedToken);

        let user
        let admin
        // we have used this if else statement because the user and admin both have same use case but both need to be operated in different file ... so this will chick where is the need 
        if (user = await User.findById(decodedToken?._id).select('-password -refreshToken')) {
            if (!user) {
                throw new apiError('invalid access token',401)
            }
            req.user = user
            next()
        }else{
            admin = await Admin.findById(decodedToken?._id).select('-password -refreshToken')
            if (!admin) {
                throw new apiError('invalid access token',401)
            }
            req.admin = admin
            next()
        }


    } catch (error) {
        console.log('laaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

        throw new apiError(`invalid access token ${error?.message}`,401)
    }
})

module.exports = verifyJWt