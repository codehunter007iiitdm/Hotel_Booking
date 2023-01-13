if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}




const express=require ('express');
const app=express();
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const ExpressError=require('./utils/error')
const session=require('express-session')
const flash=require('connect-flash')
const passport=require('passport')
const LocalStratergy=require('passport-local')
const hotelsRoutes=require('./routes/hotel')
const reviewsRoutes=require('./routes/reviews')
const User=require('./Model/user')
const usersRoutes=require('./routes/users')
const mongoSanitize=require('express-mongo-sanitize')
const dbUrl='mongodb://0.0.0.0:27017/findMyStay';
//'mongodb://0.0.0.0:27017/findMyStay'
const MongoDBStore=require("connect-mongo")(session)



const mongoose = require('mongoose')
mongoose.set('strictQuery', true);
mongoose.connect(dbUrl)
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Connected")
})

app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('__method'))
app.use(express.static(path.join(__dirname,'public')))

const store=new MongoDBStore({
    url:dbUrl,
    secret:'itsasecret',
    touchAfter: 24*60*60

});

store.on("error",function(e){
    console.log("SESSION STORE ERROR",e)
})

const sessionConfig={
    store,
    secret:'itsasecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60,
    }
}

app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(mongoSanitize());

passport.use(new LocalStratergy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.getBack=req.session.returnTo;
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})

app.use('/',usersRoutes)
app.use('/hotels',hotelsRoutes)
app.use('/hotels/:id/reviews',reviewsRoutes)


app.get('/',(req,res)=>{
    res.render('home') 
})


app.all('*',(req,res,next)=>{
    next(new ExpressError ('Page Not Found',404))
})

app.use((err,req,res,next)=>{
    const{statusCode=500}=err;
    if(!err.message)err.message="SOMETHING WENT WRONG"
    res.status(statusCode).render('hotels/error',{err});
})

app.listen(3000,()=>{
    console.log('Listening from port 3000')
})

