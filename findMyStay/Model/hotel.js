const mongoose=require('mongoose')
const Review=require('./review')
const Schema=mongoose.Schema;

const opts={toJSON:{virtuals:true}};

const hotelSchema=new Schema({
    title:String,
    price:Number,
    description:String,
    location:String,
    images:[
        {
            url:String,
            filename:String
        }],
        geometry:{
           type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
        },
    author:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }]

},opts);

hotelSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/hotels/${this._id}">${this.title}</a></strong>`
})

hotelSchema.post('findOneAndDelete',async(doc)=>{
    if(doc){
        await Review.remove({
            _id:{
                $in: doc.reviews
            }
        })
    }
})

module.exports=mongoose.model('hotel',hotelSchema)
