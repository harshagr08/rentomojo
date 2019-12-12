const express=require('express')
const homecontroller=require('../controllers/home')
const router=express.Router()
router.get('/',homecontroller.gethome)
router.post('/comment',homecontroller.postcomment)
router.get('/upvote/:id',homecontroller.getupvote)
router.get('/downvote/:id',homecontroller.getdownvote)


module.exports=router