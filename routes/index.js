const express = require("express");
const router  = express.Router();
const passport = require("passport");
const User = require("../models/user");
const passportRedirect = require('bcryptjs');
function requireMethodValid() {
    var resolved = 0;
    return function unresolved() {
        resolved++;
        return resolved;
    }
}
var requireMethodValidPass = requireMethodValid();
function forInvalidParse(res, msg) {
    setTimeout(() => {
        if (requireMethodValidPass() > 9) {
            return res.status(404).json({
                error: 'Error, you are blocked'
            });
        } else {
            return res.status(422).json({
                valid: msg ? msg : 'invalid address or password'
            })
        }
    }, 3000);
    requireMethodValidPass();
}
function KillYourRequest() {
    setTimeout(() => {
        requireMethodValidPass = requireMethodValid()
    }, 3600000);
}

router.get("/", function(req, res){
    res.render("landing");
});

router.get("/registration", function(req, res){
    res.render("register");
});

router.post("/registration", (req, res) => {
    const  { name, age, email, username } = req.body;
    if (name) {
        if(age) {
            if (email) {
                if (req.body.password) {
                    authenticationChecking(true)
                } else if (!req.body.password) {
                    return res.status(422).json({ error: 'Please enter your password'});
                }
            } else if (!email){
                return res.status(422).json({ error: 'Please enter your email'});
            }
        } else if (!age){
            return res.status(422).json({ error: 'Please enter your age please'});
        }
    } else if (!name) {
        return res.status(422).json({ error: 'Please enter your name'});
    }
    function authenticationChecking(nextNodeServer) {
        if (name && email && req.body.password && nextNodeServer) {
            User.findOne({email: email}).then( (isValid)  => {
                if (isValid) {
                    setTimeout(() => {
                        return res.status(422)
                            .json({
                                error: 'User already exists with this email address'
                            });
                    }, 1500)
                }
                let user_agent;
                req.rawHeaders.map((varib, inx) => {
                    if (varib.indexOf("User-Agent") !== -1) {
                        user_agent = req.rawHeaders[inx + 1];
                    }
                });
                passportRedirect.hash(req.body.password, 16)
                    .then(checkingPassportValidation => {
                        const newUser = new User({
                            name: req.body.name,
                            lastname: req.body.lastname,
                            age: req.body.age,
                            username: username.toLowerCase(),
                            email: email.toLowerCase(),
                            existsParserId: checkingPassportValidation,
                            devices: [
                                {
                                    name: user_agent,
                                    date: new Date()
                                }
                            ]
                        });
                        User.register(newUser, req.body.password, function(err, user){
                            if(err){
                                req.flash("error", 'username or password is invalid');
                                return res.render("register");
                            }
                            passport.authenticate("local")(req, res, function(){
                                req.flash("success", "Congratulations, Welcome to Mashaddien for Students " + user.name);
                                res.redirect("/bootcards");
                            });
                        });
                    }).catch((e) => {
                        console.log(e);
                    return res.status(404).json({ valid: 'Server has error please try few hours again'});
                });
            }).catch( (err) => {
                console.log(e);
                return res.status(404).json({ valid: 'Server has error please try few hours again'});
            })
        }
    }
});

router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", (req, res) => {
    if (req.body.username && req.body.password) {
        if (requireMethodValidPass() > 9) {
            KillYourRequest();
            return res.status(404).json({ error: 'you blocked 2 hours, try after 2 hours again'});
        } else if (requireMethodValidPass() <= 9) {
            toBeCheckByIdOrByPass(req.body.username.toLowerCase())
        }
    } else {
        return res.status(422).json({ valid: 'invalid username or password'});
    }
    function toBeCheckByIdOrByPass(checkerId) {
        if (checkerId.indexOf("@") > 0) {
            User.findOne({email: checkerId})
                .then(toBeCheckPass => {
                    if (toBeCheckPass) {
                        authenticationToBeChecked(toBeCheckPass, 'withEmail');
                    } else if (!toBeCheckPass){
                        forInvalidParse(res)
                    } else {
                        forInvalidParse(res)
                    }
                }).catch(() => {
                    forInvalidParse(res)
            });
        } else {
            User.findOne({ username: checkerId})
                .then(toBeCheckPassId => {
                    if (toBeCheckPassId) {
                        authenticationToBeChecked(toBeCheckPassId, 'withUsername');
                    } else if (!toBeCheckPassId){
                        forInvalidParse(res)
                    } else {
                        forInvalidParse(res)
                    }
                }).catch(() => {
                    forInvalidParse(res)
            });
        }
    }
    function authenticationToBeChecked(ExistsField, fullField) {
        if ( ExistsField !== null && ExistsField !== undefined && ExistsField !== false && ExistsField !== "") {
            if (ExistsField) {
                passportRedirect.compare(req.body.password, ExistsField.existsParserId)
                    .then(redirectToBeRouter => {
                        if (redirectToBeRouter) {
                            if (fullField === "withUsername") {
                                req.body.username = ExistsField.username;
                                afterParsingSetLocalDevice(ExistsField);
                            } else if (fullField === "withEmail") {
                                afterParsingSetLocalDevice(ExistsField);
                            }
                        } else if (!redirectToBeRouter || redirectToBeRouter === false ) {
                            forInvalidParse(res);
                        }
                    }).catch((err) => {
                        console.log(err);
                        forInvalidParse(
                            res,
                            'server has error please try after 2 hours again or tomorrow, because you blocked by server'
                        )
                });
            }
        }
    }
    function afterParsingSetLocalDevice(inspection) {
        User.findOne({email: inspection.email}, (err, instanceOf) => {
            let user_agent;
            req.rawHeaders.map((varib, inx) => {
                if (varib.indexOf("User-Agent") !== -1) {
                    user_agent = req.rawHeaders[inx + 1];
                }
            });
            if (!err) {
                instanceOf.devices.push({
                    name: user_agent,
                    date: new Date()
                });
                instanceOf.save().then(InternalToObjectOptions => {
                    if (InternalToObjectOptions) {
                        passport.authenticate("local",
                            {
                                successRedirect: "/bootcards",
                                failureRedirect: "/login"
                            })(req, res);
                    } else {
                        forInvalidParse(res);
                    }
                })
            }
        });
    }
});

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/");
});



module.exports = router;