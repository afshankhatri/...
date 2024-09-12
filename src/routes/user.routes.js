const express = require("express")
const router = express.Router();
const upload = require('../middlewares/multer.middleware')


const {registerUser,loginUser,logoutUser} = require('../controllers/user.controller');
const verifyJWt = require("../middlewares/auth.middleware");

router.route("/register").post(
    upload.fields([ 
        {
            name:'DispPic',
            maxCount:1
        }
    ]),registerUser)


router.route('/login').post(loginUser) //!!! wrong syntax ... we need to destructure in the above requrie statement


router.route('/logout').post(verifyJWt,logoutUser)

module.exports = router