const express = require("express");
const router  = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

router.get("/",middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            res.redirect('comments');
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

router.post("/",middleware.isLoggedIn,function(req, res){
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           res.redirect("/bootcards");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", "Something went wrong");
           } else {
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.save();
               campground.comments.push(comment);
               campground.save();
               req.flash("success", "Comment Successfully Sended from @" + comment.author.username);
               res.redirect(`/bootcards/${campground.author.username}/${campground._id}/fab`);
           }
        });
       }
   });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err) {
          res.redirect("back");
      } else {
          Campground.findById(req.params.id, function (err, campground) {
              if (!err) {
                  res.render("comments/edit", {
                      campground_id: req.params.id,
                      comment: foundComment,
                      campgroundAuthor: campground.author.username
                  });
              }
          });
      }
   });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){ // findByIdAndRemove
          res.redirect("back");
      } else {
          res.redirect(`/bootcards/${req.params.author}/${req.params.id}/fab`);
      }
   });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect(`/bootcards/${req.params.author}/${req.params.id}/fab`);
       }
    });
});

module.exports = router;