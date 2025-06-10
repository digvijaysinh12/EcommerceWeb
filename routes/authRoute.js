import express from 'express';
import {registerController,loginController, testController, forgotPasswordController, updateProfileController} from '../controllers/authController.js'
import {isAdmin, requireSignIn} from '../middleware/authMiddleware.js'
//router object
const router = express.Router();

//routing   
//REGISTER || METHOD POST
router.post('/register' , registerController);

//LOGIN || METHOD POST
router.post('/login', loginController);

//FORGOT PASSWORD || METHOD POST
router.post('/forgot-password', forgotPasswordController);

//TEST || ROUTES
router.get('/test',requireSignIn,isAdmin,testController);

//PROTECTED ROUTE FOR AUTHENTICATION
router.get('/user-auth' , requireSignIn, (req,res) => {
    res.status(200).send({ok:true});
})

//PROTECTED ROUTE FOR ADMIN PAGE
router.get('/user-admin' , requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ok:true});
})

//UPDATE PROFILE
router.put("/profile",requireSignIn,updateProfileController);

//ORDERS
router.get('/orders',requireSignIn, getOrderController);

export default router;