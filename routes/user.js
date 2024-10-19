const express=require("express");
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const router=express.Router();
const userController=require("../controllers/user.js");


router
    .route("/signup")
    .get(userController.renderSignupform)
    .post(wrapAsync(userController.signup));

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,passport.authenticate("local", {
    failureRedirect: "/login",  // Correct the typo here
    failureFlash: true
}), userController.login);

router.get("/logout",userController.logout);

module.exports=router;