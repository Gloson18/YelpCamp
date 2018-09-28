var middlewareObj = {},
    Campground = require("../models/campground"),
    Comment = require("../models/comment");

middlewareObj.checkCampgroundOwnship = function(req, res, next) {
    //is user logged in?
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                req.flash("error", "Error");
                res.redirect("back");
            }
            else {
                //doest the user own the campground
                //foundCampground.author.id is a mongoose object
                //req.user._id is a string, so === or == won't work
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error", "You don't have the authorization.");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "Please Login Before Moving Forward.");
        res.redirect("back");
    }
};


middlewareObj.checkCommentOwnership = function(req, res, next) {
    //is user logged in?
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                req.flash("error", "Error");
                res.redirect("back");
            }
            else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error", "You don't have the authorization.");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "Please Login Before Moving Forward.");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    //must before the showing page
    req.flash("error", "Please Login Before Moving Forward.");
    res.redirect("/login");
};


module.exports = middlewareObj;