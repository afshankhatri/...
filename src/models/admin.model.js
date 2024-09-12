const mongoose = require('mongoose')
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")
require('dotenv').config({path:"./env"})
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const AdminSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        index:true
    },
    userName:{ //
        type:String,
        required:true,
        unique:true,
        index:true
    },
    password:{
        type:String,
        required:true,    
    },
    email:{
        type:String,
        required:true,
        unique:true,
        index:true
    },
    contactNum:{
        type:Number,
        unique:true,
    },
    DOB:{
        type:Date,
        required:true,
    },
    department :{
        type:String,
        required:true
    },
    qualification:{
        type:String,
        required:true
    },
    DispPic:{
        type:String,
        required:true
    },
    refreshToken:{
        type: String
    }
    //achievements//professional certificate
},{timestamps:true})

AdminSchema.plugin(aggregatePaginate)
AdminSchema.pre("save",async function(next){
    if (!this.isModified('password'))return next();
    this.password = await bcrypt.hash(this.password,10)
    next()
})
AdminSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}


AdminSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            name:this.name,
            password:this.password,
            userName:this.userName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

AdminSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            name:this.name,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


const Admin = mongoose.model("Admin",AdminSchema)
module.exports = Admin