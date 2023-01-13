const hotel=require('../Model/hotel')
const review=require("../Model/review")

module.exports.createReview=async(req,res)=>{
    const Hotel=await hotel.findById(req.params.id);
    const newReview=new review(req.body.review);
    newReview.author=req.user._id
    Hotel.reviews.push(newReview)
    await newReview.save();
    await Hotel.save();
    res.redirect(`/hotels/${Hotel._id}`)
 }

 module.exports.deleteReview=async(req,res)=>{
    const{id,reviewId}=req.params
    await review.findByIdAndDelete(reviewId);
    await hotel.findByIdAndUpdate(id,{$pull:{reviews: reviewId}})
    res.redirect(`/hotels/${id}`)
}