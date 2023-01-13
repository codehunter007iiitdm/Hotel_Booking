const express=require('express')
const router=express.Router()
const catchAsync=require('../utils/asyncError')
const ExpressError=require('../utils/error')
const hotel=require('../Model/hotel')
const hotels=require('../controllers/hotels')
const Joi=require('joi')
const {isLoggedIn,isAuthor,isReviewAuthor}=require('../middleware')
const multer  = require('multer')
const {storage}=require('../cloudinary')
const upload = multer({storage})

const validateHotel=(req,res,next)=>{
    const hotelSchema=Joi.object({
        title:Joi.string().required(),
        location:Joi.string().required(),
        //image:Joi.string().required(),
        price:Joi.number().required().min(0),
        description:Joi.string().required()
    })
    const { error }=hotelSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400)
    }
    else{
        next()
    }
}


router.get('/',catchAsync(hotels.index))

router.get('/new',isLoggedIn,hotels.renderNewForm)

router.post('/',isLoggedIn,upload.array('image'),validateHotel,catchAsync(hotels.createHotel))

router.get('/:id',catchAsync(hotels.showHotel))

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(hotels.renderEditForm))

router.put('/:id',isLoggedIn,
                  isAuthor,
                  upload.array('image'),
                  validateHotel,catchAsync(hotels.update))

router.delete('/:id',isLoggedIn,catchAsync(hotels.deleteHotel))

module.exports=router;
