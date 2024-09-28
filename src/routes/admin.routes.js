const express = require('express')
const routeradmin = express.Router()
const upload = require('../middlewares/multer.middleware')

const {registerAdmin,loginAdmin,logoutAdmin} = require('../controllers/admin.controller')
const verifyJWt = require('../middlewares/auth.middleware')

routeradmin.get('/signup',(req,res)=>{
    res.render('adminInfo')
})

routeradmin.route('/register').post(
    upload.fields([
        {
            name:"DispPic",
            maxCount:1
        }
    ]),registerAdmin)

routeradmin.route('/login').post(loginAdmin)

routeradmin.route('/logout').post(verifyJWt,logoutAdmin)

module.exports = routeradmin

//now work upon complete registration of admin along with profile display
//user k profile ko update karna hai wo wala part bhi baki hai ...<us me finduseridandUpdate wala scene hoga with $set{},new{} ye sab use hoga us me>