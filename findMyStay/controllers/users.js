const User=require('../Model/user')


module.exports.renderRegisterForm=(req,res)=>{
    res.render('auth/register')
}

module.exports.registerUser=async(req,res,next)=>{
    try{
     const{email,username,password}=req.body;
     const user=new User({email,username})
     const registeredUser=await User.register(user,password)
     req.login(registeredUser,err=>{
         if(err) return next(err);
         req.flash('success','Welcome to FindMyStay');
         res.redirect('/hotels')
     })
 }
    catch(e){
     req.flash('error',e.message)
     res.redirect('register')
 }
 }

 module.exports.login=(req,res)=>{
    req.flash('success','welcome back!');
    const redirectUrl=res.locals.getBack || '/hotels';
    res.redirect(redirectUrl)
}

module.exports.logout=(req,res,next)=>{
    req.logout(function(err){
        if(err){
            return next(err);
        }
        req.flash('success','Logged Out Successfully')
        res.redirect('/hotels')
    });
}

module.exports.renderLogin=(req,res)=>{
    res.render('auth/login')
}