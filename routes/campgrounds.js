var express = require("express");
var router = express.Router({mergeParams: true});

var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
//INDEX show all
router.get("/",function(req,res){
    
    //get all campgrounds from DB
    Campground.find({},function(err,allcampgrounds){
        if(err){
        }
        else{
            res.render("campgrounds/Index",{campgrounds: allcampgrounds});
        }
    });
    
})
//Create
router.post("/",middleware.isLoggedIn,function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author={
        id: req.user._id,
        username:req.user.username
    };
    var newCampground = {name:name, image:image, description:desc, author:author};
    //Create a new campground and save it to the database
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log("err");
        }
        else{
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
    //get data from form and add to campgrounds array
    //redirect back to campgrounds page
});
//NEW route
router.get("/new",middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new.ejs");
});

//SHOW route
router.get("/:id",function(req,res){
    //find the campgrounds 
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err || !foundCampground){
            console.log(err);
            req.flash("error","Campground not found");
            return res.redirect("back");
        }
        else{
            res.render("campgrounds/show",{campground: foundCampground});
        }
    })
    

})


// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership,function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
      }
   });
});




module.exports = router;