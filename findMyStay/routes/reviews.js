const express=require('express')
const router=express.Router({mergeParams: true})
const catchAsync=require('../utils/asyncError')
const review=require("../Model/review")
const hotel=require('../Model/hotel')
const {isLoggedIn,isReviewAuthor}=require('../middleware')
const reviews=require('../controllers/reviews')


router.post('/',isLoggedIn,catchAsync(reviews.createReview))
 
 router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview))

 module.exports=router;