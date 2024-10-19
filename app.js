if(process.env.NODE_ENV!="production"){
require('dotenv').config();}
// console.log(process.env.SECRET);


const express=require('express');
const app=express();

const methodOverride=require("method-override");
app.use(methodOverride("_method"));

const ejsMate=require("ejs-mate");
app.engine('ejs', ejsMate);


const ExpressError  = require("./utils/ExpressError.js");

const session=require("express-session");
const MongoStore=require('connect-mongo');

const flash=require("connect-flash");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require('./routes/user.js')

const passport=require('passport');
const localStrategy=require('passport-local');
const User=require('./models/user.js');


const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());



const dbUrl=process.env.ATLASDB_URL
const mongoose = require('mongoose');
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
}





const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error",()=>{
    console.log("Error in Mongo Session Store",err);
})

const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true, 
    }
};



//this is should be like this first flash then in middle the middleware
// and then the routes
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.signup=req.flash("signup");
    res.locals.currUser=req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser= new User({
//         email:"fakeuser@gmail.com",
//         username:"fakeuser",
//     });
//     let registeredUser=await User.register(fakeUser,"fakeUser");
//     res.send(registeredUser);
// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
// Till here





app.all("*",(req,res,next)=>{
    next( new ExpressError(404,"Page Not Found!"))
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    res.render("error.ejs",{message,statusCode});
    console.log("Middleware");
})
app.listen("8080",()=>{
    console.log("Port 8080 Working.");
})