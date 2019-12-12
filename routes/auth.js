const express=require('express')
const authcontroller=require('../controllers/auth')
const router=express.Router()
router.get('/login',authcontroller.getlogin)
router.get('/signup',authcontroller.getsignup)
router.post('/signup',authcontroller.postsignup)
router.post('/login',authcontroller.postlogin)
router.get('/logout',authcontroller.getlogout)

module.exports=router