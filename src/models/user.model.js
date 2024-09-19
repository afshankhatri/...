const  mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")
require('dotenv').config({path:"./env"})
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


const UserSchema = new mongoose.Schema({
    name:{ // 1st name ,last name ,middle name 
        type:String,
        required:true,
        index:true
    },
    userName:{ //changed from userName
        type:String,
        required:true,
        unique:true,
        index:true
    },
    password:{
        type:String,
        required:true,    
    },
    email:{// normal + college domain 
        type:String,
        required:true,
        unique:true,
        index:true
    },
    collegedomain:{
        type:String,
        required:false
 
    },
    contactNum:{
        type:Number,
        unique:true,
    },
    DOB:{
        type:Date,
        required:true,
    },
    ProgStartYear:{
        type:Number,
        required:true,
    },
    GraduationYear:{
        type:Number,
        required:true,
    },
    linkedin:{
        type:String,
        required:true,
        index:true
    },
    
    DispPic:{
        type:String,
        required:true
    },
    cgpa:{
        type:Number,
        required:true,
    },
    lor:{
        type:String,
        // required:false
 
    },
    resume:{
        type:String,
        // required:false
 
    },
    class10:{
        type:String,
        // required:false
 
    },
    class12:{
        type:String,
        // required:false
 
    },
    gateScore:{
        type:String,
        // required:false
 
    }, 
    description:{
        type:String,
        // required:false
 
    },
    extraCurriculars:{
        type:String,
        // required:false
    },
    Department:{
        type:String,
        // required:true
    },
    certifications:{
        type:String,
        // required:true
    },
    internship:{
        type:String,
        // required:true
    },
    researchPaper:{
        type:String,
        // required:true
    },
    refreshToken:{
        type: String
    }
    
},{timestamps:true})







UserSchema.plugin(aggregatePaginate);

UserSchema.pre('save',async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,10)
    next()
})

UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password) 
}





//CREATING TOKENS FOR AUTHENTICATION AND AUTHORIZATION
UserSchema.methods.generateAccessToken = function(){
    return jwt.sign(//(payloads,accessToken, expiresIn)
    // payload
    { //enter things which you want for Authentication and authorization...like password and username
        _id:this._id,//this is available byDefault in our DB
        // email:this.email,
        // password: this.password,
        // userName: this.userName
    },//accessToken
    process.env.ACCESS_TOKEN_SECRET,
    {//expiresIn
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
// SIMILARLY
UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign(//(payloads,RefreshToken, expiresIn)
    { 
        _id:this._id,
        // name:this.name,
        userName: this.userName,
        // password: this.password
        
        //it has less info since it is just used to refresh the account

    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)
}



const User = /*new*/ mongoose.model("User",UserSchema)
module.exports = User
// module.exports = mongoose.model("User",UserSchema)