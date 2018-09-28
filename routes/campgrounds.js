var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware");

router.get("/", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
    //get data from form and add to database
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: description, author: author};
    Campground.create(newCampground, function(err, newAdd) {
        if (err) {
            console.log(err);
        }  
        else {
            //redirect to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnship, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            req.flash("error", "Campground not found.");
        }
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//update campground route
router.put("/:id", middleware.checkCampgroundOwnship, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            req.flash("success", "Update successfully.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnship, function(req, res) {
    Campground.findByIdAndDelete(req.params.id, function(err) {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            req.flash("success", "Campground deleted.");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;