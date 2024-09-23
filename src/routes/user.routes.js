const express = require("express")
const router = express.Router();
const upload = require('../middlewares/multer.middleware')


const {registerUser,loginUser,logoutUser,getUserProfile} = require('../controllers/user.controller');
const verifyJWt = require("../middlewares/auth.middleware");

//this will display
router.get('/signup',(req,res)=>{
    res.render('studentsInfo')
})
router.get('/home',(req,res)=>{
    res.render('index')
})
router.get('/dashboard',verifyJWt,(req,res)=>{
    res.render('dashBoard')
})
router.get('/profile',(req,res)=>{
    res.render('userProfile')
})
router.get('/messages',(req,res)=>{
    res.render('userMessage')
})
router.get('/status',(req,res)=>{
    res.render('interviewStatus')
})
router.get('/network',(req,res)=>{
    res.render('network')
})

//main backend for particular click/command/instruction
router.route("/register").post(
    upload.fields([ 
        {
            name:'DispPic',
            maxCount:1
        },
        {
            name:'researchPaper',
            maxCount:1
        },
        {
            name:'gateScore',
            maxCount:1
        },
        {
            name:'internship',
            maxCount:1
        },
        {
            name:'certifications',
            maxCount:1
        },
        {
            name:'class12',
            maxCount:1
        },
        { 
            name:'class10',
            maxCount:1
        },
        {
            name:'resume',
            maxCount:1
        },
        {
            name:'lor',
            maxCount:1
        }
    ]),registerUser)




router.route('/login').post(loginUser) //!!! wrong syntax ... we need to destructure in the above requrie statement


router.route('/logout').post(verifyJWt,logoutUser)

// router.route('/profile').post(verifyJWt,getUserProfile)

module.exports = router
