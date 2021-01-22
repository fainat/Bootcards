const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { nodeServerMongoSecure } = require("./node-server");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user");
const session = require("express-session");
const seedDB = require("./seed");
const methodOverride = require("method-override");
const cors = require("cors");

//requiring routes
const commentRoutes = require("./routes/comments"),
    userRoutes = require("./routes/profile"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index")

mongoose.connect(nodeServerMongoSecure, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => (console.log('Connected Server')))
    .catch((err) => (console.log(err)));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(flash());

app.use(require("express-session")({
    secret: "Mashaddien Social Boot Comments & Boot Card for Students_security",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(cors());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use("/", indexRoutes);
app.use("/bootcards/:user/profile", userRoutes);
app.use("/bootcards", campgroundRoutes);
app.use("/bootcards/:author/:id/comment", commentRoutes);

app.get('*', function (req, res) {
    res.render('landing');
});

const PORT = process.env.PORT || 8004

app.listen( PORT, function () {
    console.log('Bootcard server is listening ' + PORT);
});