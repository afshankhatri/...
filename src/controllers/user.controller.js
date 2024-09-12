const asyncHandler = require('../utils/asyncHandler')
const apiError = require('../utils/apiError')
const uploadOnCloudinary = require('../utils/cloudinary')
const User = require('../models/user.model')
const apiResponse = require('../utils/apiResponse')
const path = require('path')
const upload = require('../middlewares/multer.middleware')
// const { options } = require('../app')


// genereal Method for calling access and refresh token
const generateAccessAndRefreshToken = async(userID)=>{
    try {
        const userToken = await User.findById(userID)
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


const registerUser = asyncHandler(async (req,res)=>{
    //destructuring so that we dont have to write name.req.body and similarly for others ...just write name and it's done
    const{contactNum,email,password,userName,name,DOB,ProgStartYear,GraduationYear,linkedin,DispPic} = req.body


    if (
        [contactNum,email,password,userName,name,DOB,ProgStartYear,GraduationYear,linkedin,DispPic]
        .some((field)=>field?.trim() === '')) {
        throw new apiError('all the fields needs to be filled',400)
    }

    
    const ExistingUser = await User.findOne({
        $or:[{userName},{email}]
    })
    if (ExistingUser) {
        throw new apiError('user exist ,please login with same credentials',400)
    }


    const profilePicLocalPath = req.files?.DispPic[0]?.path
    if (!profilePicLocalPath) {
        throw new apiError('profile pic is required',400)
    }
    const profilePic = await uploadOnCloudinary(profilePicLocalPath)

    // if (!DispPic) {
    //     throw new apiError('profile pic is required')
    // }
    // to enter the string of image in DB
    const user = await User.create({
        userName,
        DispPic:profilePic.url,//ye nai likhega to image post hi nai hogi
        password,
        linkedin,
        email,
        contactNum,
        name,
        DOB,
        ProgStartYear,
        GraduationYear
    })

    const userCreated =  await User.findById(user._id).select(' -password -refreshToken')
    if (!userCreated) {
        throw new apiError("something went wrong while registering user ",500)
    }

    return res.status(201).json(
        new apiResponse(200,userCreated,'user registered successfully')
    )
})

const loginUser = asyncHandler(async(req,res)=>{
    const {email,password,userName} = req.body
    if (!(email||userName)) {
        throw new apiError('enter userName or password for authorization',400)
    }

    const user = await User.findOne({
        $or : [{email},{userName}]
    })

    if (!user) {
        throw new apiError('user does not exist',404)
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new apiError('incorrect password',401)
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loginUser = await User.findById(user._id).select('-password -refreshToken')
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
                user:loginUser,accessToken,refreshToken
            },
            "user logged in successfully"
        )
    )


})

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(

     
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
    const options = {
        httpOnly:true,
        secure:true,
        sameSite:'None'
    }

    return res
    .status(200)
    .clearCookie('accessToken',options)
    .clearCookie('refreshToken',options)
    .json(new apiResponse(200,{},"user logged out"))

})


module.exports = {
    registerUser,
    loginUser,
    logoutUser
}