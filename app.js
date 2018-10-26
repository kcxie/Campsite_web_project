var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose"),
    flash    = require("connect-flash"),
    passport = require("passport"),
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local");
var Campground = require("./models/campground");
var Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seed");
    
    
var commentRoutes       = require("./routes/comments");
var campgroundRoutes    = require("./routes/campgrounds");
var indexRoutes         = require("./routes/index");
    
//seedDB();
app.use(flash());
//Passport configuration
app.use(require("express-session")({
    secret:"One hit, one love",
    resave:false,
    saveUninitialized: false
    }));
    
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://xkc:nick123456@ds129315.mlab.com:29315/kc-campproject");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("yelpcamp!");
});