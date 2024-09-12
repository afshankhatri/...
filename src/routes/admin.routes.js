const express = require('express')
const routeradmin = express.Router()
const upload = require('../middlewares/multer.middleware')

const {registerAdmin,loginAdmin,/*logoutAdmin*/} = require('../controllers/admin.controller')
// const verifyJWt = require('../middlewares/auth.middleware')

routeradmin.route('/register').post(
    upload.fields([
        {
            name:"DispPic",
            maxCount:1
        }
    ]),registerAdmin)

routeradmin.route('/login').post(loginAdmin)

// routeradmin.route('/logout').post(verifyJWt,logoutAdmin)

module.exports = routeradmin