const hotel=require('./Model/hotel')
const Review=require("./Model/review")

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
    req.session.returnTo=req.originalUrl
    req.flash('error','you must be signed in')
    return res.redirect('/login')
}
    next();
}

module.exports.isAuthor=async(req,res,next)=>{
    const {id}=req.params
    const hotels=await hotel.findById(id);
    if(!hotels.author.equals(req.user._id)){
     req.flash('error','you do not have permission to do that');
     return res.redirect(`/hotels/${id}`)
    }
    next()
 }

 module.exports.isReviewAuthor=async(req,res,next)=>{
    const {id,reviewId}=req.params
    const review=await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
     req.flash('error','you do not have permission to do that');
     return res.redirect(`/hotels/${id}`)
    }
    next()
 }