const mongoose = require('mongoose')
const DB_NAME = require('../constant')
require('dotenv').config()


const connectDB = async ()=>{
    try {
        const ConnectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("DB connected successfully",ConnectionInstance.connection.host);
        
    } catch (error) {
        console.log("connection error here in mongoose.js (try catch error)",error);
        process.exit(1)
    }
}

module.exports = connectDB