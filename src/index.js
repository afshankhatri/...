const express = require('express')
const connectDB = require('./db/mongoose')
const app = express()
require('dotenv').config({path:"./env"})
const path = require('path')
const cookieParser = require('cookie-parser')
// const router = require('./routes/')
const bcrypt = require('bcrypt');

const User = require('./models/user.model'); // Ensure the path is correct

const port = process.env.PORT

//to take js engine to run our frontend  files 
const frontend_path = path.join(__dirname,'../public/frontendCode') //to take hbs file
const static_path = path.join(__dirname,'../public/views') //to store photos

app.use(express.static('public'));
app.use(express.static(static_path))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
// app.set('view engine', 'ejs'); //if we use ejs
app.set('view engine','hbs')
app.set("views", frontend_path);


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


//REGISTRATION FOR STUDENTS
// app.get("/signup",(req,res)=>{
//     res.render('studentsInfo')
// })
// app.post("/signup",async(req,res)=>{
//     // const {collegedomain,email,password,userName,name,linkedin,GraduationYear,ProgStartYear,DOB,contactNum,class10,resume,lor,cgpa,DispPic,Department,extraCurriculars,description,gateScore,class12,researchPaper,internship,certifications} = req.body
    // const data = {
    //     collegedomain:req.body.collegedomain,
    //     email:req.body.email,
    //     password:req.body.password,
    //     userName:req.body.userName,
    //     name:req.body.name,
    //     linkedin:req.body.linkedin,
    //     GraduationYear:req.body.GraduationYear,
    //     ProgStartYear:req.body.ProgStartYear,
    //     DOB:req.body.DOB,
    //     contactNum:req.body.contactNum,
    //     class10:req.body.class10,
    //     class12:req.body.class12,
    //     resume:req.body.resume,
    //     lor:req.body.lor,
    //     cgpa:req.body.cgpa,
    //     DispPic:req.body.DispPic,
    //     Department:req.body.Department,
    //     extraCurriculars:req.body.extraCurriculars,
    //     description:req.body.description,
    //     gateScore:req.body.gateScore,
    //     researchPaper:req.body.researchPaper,
    //     internship:req.body.internship,
    //     certifications:req.body.certifications
    // }
    // await User.create([data])
    // res.render('dashBoard')

// })


// app.get("/home",(req,res)=>{
//     res.render('index')
// })

// app.post('/home', async (req, res) => {
//     try {
//         // Look for user by username or email (depending on what the user provided)
        // const check = await User.findOne({ userName: req.body.usernamOrEmail });// req.body<name>    ye name ki jagah wo name dall jo frontend pe dale ha apun ne name
//         if (!check) {
//             return res.send('User not found');
//         }

        // const isMatch = await bcrypt.compare(req.body.password, check.password);

        // if (isMatch) {
        //     return res.render('dashBoard');
        // } else {
        //     return res.send('Wrong password');
        // }

//     } catch (error) {
//         return res.send(`Error during login: ${error}`);
//     }
// });


// frontend and backend barabar se connect nai hua hai ....frontend kuch alag chal ra hai aur backend kuch alag chal ra hai!


//REGISTRATION FOR ADMIN
// app.get('/AdminSignup',(req,res)=>{
//     res.render('adminInfo')
// })


//for login write a code similar to that of in line 68