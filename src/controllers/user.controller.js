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
        console.log("checkACCESS:",accessToken);
        console.log("heyREFRESH: ",refreshToken);

        return {accessToken,refreshToken}
    } catch (error) {
        throw new apiError('error in generating access and refresh token',500)
    }

    // whenever you need to generate token ... just call this function
}


const registerUser = asyncHandler(async (req,res)=>{
    //destructuring so that we dont have to write name.req.body and similarly for others ...just write name and it's done
    const{contactNum,email,password,userName,name,DOB,ProgStartYear,GraduationYear,linkedin,DispPic,description,
        extraCurriculars,
        researchPaper,
        internship,
        gatescore,
        certifications,
        Department,
        class12,
        class10,
        resume,
        collegedomain,
        cgpa,
        lor} = req.body


    if (
        [contactNum,email,password,userName,name,DOB,ProgStartYear,GraduationYear,linkedin,DispPic,description,
            extraCurriculars,
            researchPaper,
            internship,
            gatescore,
            certifications,
            Department,
            class12,
            class10,
            resume,
            collegedomain,
            cgpa,
            lor]
        .some((field)=>field?.trim() === '')) {
        throw new apiError('all the fields needs to be filled',400)
    }

    
    const ExistingUser = await User.findOne({
        $or:[{userName},{email}]
    })
    if (ExistingUser) {
        throw new apiError('user exist ,please login with same credentials',400)
    }

    // const researchPaperLocalPath = req.files?.researchPaper[0]?.path
    // const lorLocalPath = req.files?.lor[0]?.path
    // const internshipLocalPath = req.files?.internship[0]?.path
    // const class10LocalPath = req.files?.class10[0]?.path
    // const class12LocalPath = req.files?.class12[0]?.path
    // const gateScoreLocalPath = req.files?.gatescore[0]?.path
    // const resumeLocalPath = req.files?.resume[0]?.path
    // const certificationsLocalPath = req.files?.certifications[0]?.path

    
    const researchPaperLocalPath = req.files?.researchPaper?.[0]?.path;
    if (!researchPaperLocalPath) {
        throw new apiError('Research paper is required', 400);
    }
    const research = await uploadOnCloudinary(researchPaperLocalPath);
    
    const lorLocalPath = req.files?.lor?.[0]?.path;
    if (!lorLocalPath) {
        throw new apiError('Letter of Recommendation (LOR) is required', 400);
    }
    const LOR = await uploadOnCloudinary(lorLocalPath);
    
    const internshipLocalPath = req.files?.internship?.[0]?.path;
    if (!internshipLocalPath) {
        throw new apiError('Internship document is required', 400);
    }
    const internships = await uploadOnCloudinary(internshipLocalPath);
    
    const class10LocalPath = req.files?.class10?.[0]?.path;
    if (!class10LocalPath) {
        throw new apiError('Class 10 certificate is required', 400);
    }
    const clas10 = await uploadOnCloudinary(class10LocalPath);
    
    const class12LocalPath = req.files?.class12?.[0]?.path;
    if (!class12LocalPath) {
        throw new apiError('Class 12 certificate is required', 400);
    }
    const clas12 = await uploadOnCloudinary(class12LocalPath);
    
    const gateScoreLocalPath = req.files?.gateScore?.[0]?.path;
    if (!gateScoreLocalPath) {
        throw new apiError('GATE score document is required', 400);
    }
    const gateScore = await uploadOnCloudinary(gateScoreLocalPath);
    
    const resumeLocalPath = req.files?.resume?.[0]?.path;
    if (!resumeLocalPath) {
        throw new apiError('Resume is required', 400);
    }
    const resum = await uploadOnCloudinary(resumeLocalPath);
    
    const certificationsLocalPath = req.files?.certifications?.[0]?.path;
    if (!certificationsLocalPath) {
        throw new apiError('Certifications are required', 400);
    }
    const certification = await uploadOnCloudinary(certificationsLocalPath);
    
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
        GraduationYear,
        description,
        extraCurriculars,
        researchPaper:research.url,
        internship:internships.url,
        gatescore:gateScore.url,
        certifications:certification.url,
        Department,
        class12:clas12.url,
        class10:clas10.url,
        resume:resum.url,
        collegedomain,
        cgpa,
        lor:LOR.url,
        name
    })

    const userCreated =  await User.findById(user._id).select(' -password -refreshToken')
    if (!userCreated) {
        throw new apiError("something went wrong while registering user ",500)
    }

    return res
    .status(201).json(
        new apiResponse(200,userCreated,'user registered successfully')
    )
    .render('index')//yaha pe 
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
        secure:false,
        sameSite:'Lax'
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
        secure:true, //wehen using in production change this to true 
        sameSite:'none'
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