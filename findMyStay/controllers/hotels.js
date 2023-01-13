const hotel=require('../Model/hotel')
const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbxGeocoding({accessToken:mapBoxToken})
const cloudinary=require('../cloudinary')

module.exports.index=async(req,res)=>{
    const hotels=await hotel.find({});
    res.render('hotels/index',{ hotels })
}

module.exports.renderNewForm=(req,res)=>{
    res.render('hotels/new')
}

module.exports.createHotel=async(req,res,next)=>{
    const geoData=await geocoder.forwardGeocode({
        query:req.body.location,
        limit:1
    }).send()
    const newHotel=new hotel(req.body);
    newHotel.geometry=geoData.body.features[0].geometry;
    newHotel.images=req.files.map(f=>({url:f.path,filename:f.filename}))
    newHotel.author=req.user._id;
    await newHotel.save();
    console.log(newHotel)
    req.flash('success','Successfully Created A Hotel')
    res.redirect(`/hotels/${newHotel._id}`)
}

module.exports.showHotel=async (req,res)=>{
    const {id} = req.params;
    const hotels=await hotel.findById(id).populate({
        path:'reviews',
    populate:{
        path:'author'
    }
}).populate('author');
    if(!hotels){
        req.flash('error','Cannot find the hotel')
        return res.redirect('/hotels')

    }
    res.render('hotels/show',{hotels})
}

module.exports.renderEditForm=async(req,res)=>{
    const editHotel=await hotel.findById(req.params.id)
    if(!editHotel){
        req.flash('error','Cannot find the hotel')
        return res.redirect('/hotels')
    }
    res.render('hotels/edit',{editHotel})
}

module.exports.update=async(req,res)=>{
    const{id}=req.params;
     const Hotel=await hotel.findByIdAndUpdate(req.params.id,{...req.body})
     const imgs=req.files.map(f=>({url:f.path,filename:f.filename}))
     Hotel.images.push(...imgs)
     await Hotel.save()
    req.flash('success','Succesfully Updated Hotel')
    res.redirect(`/hotels/${Hotel._id}`)
 }

 module.exports.deleteHotel=async(req,res)=>{
    const{id}=req.params;
    const hotels=await hotel.findById(id);
    if(!hotels.author.equals(req.user._id)){
     req.flash('error','you do not have permission to do that');
     return res.redirect(`/hotels/${id}`)
    }
    await hotel.findByIdAndDelete(id);
    req.flash('success','Succesfully Deleted Hotel')
    res.redirect('/hotels')
}