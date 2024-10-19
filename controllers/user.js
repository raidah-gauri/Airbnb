const User=require("../models/user.js");

module.exports.renderSignupform=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUSer=new User({username,email});
    const regisUSer=await User.register(newUSer,password);
    console.log(regisUSer);

    req.login(regisUSer,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to Wanderlust!");
        res.redirect("/listings");
    })

    
    }catch(e){
        req.flash("singup",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async (req, res) => {
    req.flash("success","Welcome to Wanderlust")
    let redirectUrl=res.locals.redirectUrl || "/listings";
   res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
        return next(err)
        }
    req.flash("success","You logged out!");
    res.redirect("/listings");
});
};