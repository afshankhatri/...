const express = require('express')
// const router = express.Router()
const cors = require('cors')
const cookieParser =require('cookie-parser')
const path = require('path');

const app = express()

// .use is used when: we want to do some middlewawre type of work
app.use(cors({
    origin:process.env.CORS_ORIGIN,//origin tells us that ,kon kon is ka access le sakta hai (apun ne * dia hai matlab kahi se bhi request aigi accept kar lega)
    credentials: true
}))

const static_path = path.join(__dirname,'./public');


app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true,limit:'16kb'}))
app.use(express.static(static_path))
app.use(cookieParser())


// taking controllers and routes
// const userRouter = require('../src/routes/user.routes')
// app.use('/user',userRouter)

module.exports = app