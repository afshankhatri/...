const express = require('express')
const connectDB = require('./db/mongoose')
const app = express()
require('dotenv').config({path:"./env"})
const path = require('path')
// const router = require('./routes/')

const port = process.env.PORT

//to take js engine to run our frontend  files 
const frontend_path = path.join(__dirname,'../public/frontendCode') //to take hbs file
const static_path = path.join(__dirname,'../public/views') //to store photos

app.use(express.static('public'));
app.use(express.static(static_path))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
// app.set('view engine', 'ejs'); //if we use ejs
app.set('view engine','hbs')
app.set("views", frontend_path);

app.get("/home",(req,res)=>{
    res.render('index')
})

app.get("/signup",(req,res)=>{
    res.render('studentsPersonalInfo')
})
app.get("/signup/qualification",(req,res)=>{
    res.render('EduInfo')
})
app.get('/dashboard',(req,res)=>{
    res.render('dashBoard')
})



//taking controllers and routes
const router = require('../src/routes/user.routes')
app.use('/user',router)

const routeradmin = require("../src/routes/admin.routes")
app.use("/admin",routeradmin)



connectDB()
.then(()=>{
    app.on("error",(error)=>{ //double quotes me error is liye likha hai Q K app.on bahut si chizo k liye kaam ata hai..us me se apne ko error wala kam kara na hai isliye wo likha hai..just like we do in addeventlistner("click",()=>{})
        console.log("there is an error here in index.js (app.on)",error);
        throw error
    })
    app.listen(port,()=>{
        console.log(`server is running on port ${port} `);
        
    } )
})
.catch((error)=>{
    console.log('connection failed here in index.js (.cathc)',error);
})