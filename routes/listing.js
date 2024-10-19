const express=require("express");
const router=express.Router();
const wrapAsync  = require("../utils/wrapAsync.js");

const Listing=require("../models/listing");
const {isLoggedIn, isOwner,validateListing}=require("../middlewares.js");


const multer  = require('multer');

const {storage}=require("../cloudConfig.js");

const upload = multer({ storage })


const ListingControllers=require("../controllers/listing.js");

router
.route("/")
// Index Route
.get(wrapAsync(ListingControllers.index ))
// Create
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(ListingControllers.createListing));




// New Route should be placed on top of id.
router.get("/new",isLoggedIn,ListingControllers.renderNewForm)




router.
    route("/:id")
    // Show Route
    .get(wrapAsync(ListingControllers.showListing))

    // Update / Edit Put Route
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(ListingControllers.updateListing))

    // Delete Route
    .delete(isLoggedIn,isOwner,wrapAsync(ListingControllers.destroyListing));





// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(ListingControllers.renderEditForm));




module.exports=router;