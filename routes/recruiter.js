const express=require('express');

const router=express.Router();

const {register,login,logout,profile}=require('../controllers/recruiter')

const {isAuthenticated}=require('../middleware/verifyToken')

router.route('/register').post(register);

router.route('/login').post(login);

module.exports=router;