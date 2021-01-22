const express = require("express");
const router  = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");

router.get("/", middleware.isLoggedIn, function(req, res){
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           res.redirect('/bootcards');
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    var newCampground = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    }
    if(newCampground.name && newCampground.description !== "") {
        Campground.create(newCampground, function(err, newlyCreated){
            req.flash("error", 'Boot Comments Card Successfully Created Click and Edit Your Boot');
            if(err){
                res.redirect("/bootcards");
            } else {
                res.redirect("/bootcards");
            }
        });
    } else {
        res.redirect('/bootcards/new');
    }
});

router.get("/fab", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

router.get("/:author/:id/fab", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            res.redirect('/bootcards');
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/bootcards");
       } else {
           Campground.findById(req.params.id, function (err, campground) {
               res.redirect(`/bootcards/${campground.author.username}/${req.params.id}/fab`);
           });
       }
    });
});

router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndDelete(req.params.id, function(err){
      if(err){ // or remove
          res.redirect("/bootcards");
      } else {
          res.redirect("/bootcards");
      }
   });
});


module.exports = router;

