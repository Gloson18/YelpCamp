var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");

router.get("/", function(req, res) {
    res.render("landing");
});

//Auth routes
router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            return res.render("register", {"error": err.message});
        }
        else {
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "Welcome! " + user.username);
                res.redirect("/campgrounds");
            });
        }
    });
});

router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
    
});

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You have logged out.");
    res.redirect("/campgrounds");
});

module.exports = router;