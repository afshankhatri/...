const Admin = require("../models/admin.model")
const apiError = require("../utils/apiError")
const apiResponse = require("../utils/apiResponse")
const asyncHandler = require("../utils/asyncHandler")
const uploadOnCloudinary = require("../utils/cloudinary")

const path = require('path')
const upload = require("../middlewares/multer.middleware")


const generateAccessAndRefreshToken = async(userID)=>{
    try {
        const userToken = await Admin.findById(userID)
        const accessToken = userToken.generateAccessToken()
        const refreshToken = userToken.generateRefreshToken()

        userToken.refreshToken = refreshToken
        await userToken.save({validateBeforeSave:false})
        console.log("check:",accessToken);
        console.log("hey: ",refreshToken);

        return {accessToken,refreshToken}
    } catch (error) {
        throw new apiError('error in generating access and refresh token',500)
    }

    // whenever you need to generate token ... just call this function
}


const registerAdmin = asyncHandler(async(req,res)=>{
    const {DispPic,qualification,department,DOB,contactNum,email,password,userName,name} = req.body

    if ([DispPic,qualification,department,DOB,contactNum,email,password,userName,name]
        .some((field)=>field?.trim() === '' )) {
        throw new apiError('all the fields require for admin registratioin',400)
    }

    const ExistingAdmin = await Admin.findOne({
        $or:[{userName},{email}]
    })
    if (ExistingAdmin) {
        throw new apiError("this admin exists",400)
    }

    const profilePicLocalPath = req.files?.DispPic[0]?.path
    if (!profilePicLocalPath) {
        throw new apiError("profile pic is required",400)
    }

    const profilePic = await uploadOnCloudinary(profilePicLocalPath)

    const admin = await Admin.create({
        DispPic:profilePic.url, //ye nai likhega to image post hi nai hogi
        qualification,
        department,
        DOB,
        contactNum,
        email,
        password,
        userName,
        name
    })

    const adminCreated = await Admin.findById(admin._id).select('-password -refreshToken')
    if (!adminCreated) {
        throw new apiError('something went wrong while registering admin ,try again later',500)
    }
    return res.status(201).json(
        new apiResponse(200,adminCreated,"admin profile created successfully")
    )
}) 

const loginAdmin = asyncHandler(async(req,res)=>{
    const {email,password,userName} = req.body
    if(!(email || userName)){
        throw new apiError('enter username or email for authorization of admin',400)
    }

    const admin = await Admin.findOne({
        $or:[{email},{userName}]
    })

    if (!admin) {
        throw new apiError("admin does not exist ",404)
    }

    const isPasswordValid = await admin.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new apiError ('incorrect password for admin ',401)
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(admin._id)
    const loginAdmin = await Admin.findById(admin._id).select("-password -refreshToken")
    const options = {//this will allow only server to mdodify the cookies
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie('accessToken',accessToken,options)
    .cookie('refreshToken',refreshToken,options)
    .json(
        new apiResponse(
            200,
            {
                user:loginAdmin,accessToken,refreshToken
            },
            "user logged in successfully"
        )
    )
})

// const logoutAdmin

module.exports = {
    registerAdmin,
    loginAdmin
}