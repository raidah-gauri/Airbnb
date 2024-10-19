const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync  = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middlewares.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const reviewController= require("../controllers/review.js");









// Reviews 
// Post Route
router.post("/",isLoggedIn,validateReview ,wrapAsync(reviewController.createReview));

// Delete for reviews
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));
module.exports=router;