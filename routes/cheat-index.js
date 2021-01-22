router.post("/registration", function(req, res){
    let newUser = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.passport
    });
    if (!newUser) {
        req.flash("error", 'username or password is valid');
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", 'username or password is valid');
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Congratulations, Welcome to Mashaddien for Students " + user.name);
            res.redirect("/bootcards");
        });
    });
});
// authentication for fakers

router.post("/regis", (req, res) => {
    const  { passportName, passportDate, passportId, passportNumber } = req.body;
    if (passportName) {
        if(passportDate) {
            if (passportId) {
                if (passportNumber) {
                    authenticationChecking(true)
                } else if (!passportNumber) {
                    return res.status(422).json({ error: 'Please enter your password'});
                }
            } else if (!passportId){
                return res.status(422).json({ error: 'Please enter your email'});
            }
        } else if (!passportDate){
            return res.status(422).json({ error: 'Please enter your age please'});
        }
    } else if (!passportName) {
        return res.status(422).json({ error: 'Please enter your name'});
    }
    function authenticationChecking(nextNodeServer) {
        if (passportName && passportId && passportNumber && nextNodeServer) {
            User.findOne({email: passportId}).then( (isValid)  => {
                if (isValid) {
                    return res.status(422)
                        .json({
                            error: 'User already exists with this email address'
                        });
                }
                passportRedirect.hash(passportNumber, 16)
                    .then(checkingPassportValidation => {

                    }).catch((e) => {
                    return res.status(404).json({ valid: 'Server has error please try few hours again'});
                });
            }).catch( (err) => {
                return res.status(404).json({ valid: 'Server has error please try few hours again'});
            })
        }
    }
});