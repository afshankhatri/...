const express = require("express")
const router = express.Router();
const upload = require('../middlewares/multer.middleware')


const {registerUser,loginUser,logoutUser} = require('../controllers/user.controller');
const verifyJWt = require("../middlewares/auth.middleware");
//this will display
router.get('/signup',(req,res)=>{
    res.render('studentsInfo')
})
router.get('/home',(req,res)=>{
    res.render('index')
})
router.get('/dashboard',(req,res)=>{
    res.render('dashBoard')
})

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
router.get('/signup',(req,res)=>{
    res.render('studentsInfo')
})
router.get('/home',(req,res)=>{
    res.render('index')
})
router.get('/dashboard',(req,res)=>{
    res.render('dashBoard')
})



router.route('/login').post(loginUser) //!!! wrong syntax ... we need to destructure in the above requrie statement


router.route('/logout').post(verifyJWt,logoutUser)

module.exports = router
