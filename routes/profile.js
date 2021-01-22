const express = require("express");
const router  = express.Router();
const passport = require("passport");
const middleware = require("../middleware");
const User = require("../models/user");

router.get("/", middleware.isLoggedIn, (req, res) => {
    res.render('user/editProfile');
});

router.put("/", middleware.isLoggedIn, (req, res) => {
    if (req.body.user.email) {
        User.findOne({email: req.body.generatePass}).then(oldUserInfo => {
            const authenticationParser = new User ({
                name: req.body.name,
                lastname: req.body.lastname,
                age: req.body.age,
                username: req.body.username,
                email: req.body.email,
            });
            User.findByIdAndUpdate(oldUserInfo.id, req.body.user, (err, userResponse) => {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect(`/bootcards/${userResponse.username}/profile`);
                    req.flash("success", 'Your profile updated successfully');
                }
            });
        }).catch(() => {
            req.flash("error", 'something went wrong');
        });
    } else {
        req.flash("error", 'enter your email please');
    }
});

module.exports = router;