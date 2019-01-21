var passport = require('passport');
var Review = require('../models/review');
var User = require('../models/user');
var Product = require('../models/product');

exports.post_review = function (req, res, next) {
    //check if the user has already reviewed
    Product.findOne({ _id: req.params.id }).populate({
        path: 'reviews',
        populate: {
            path: 'user',
            model: 'User'
        }
    }).exec(function (err, product) {
            var flag = true;
            if (err) {
                next(err);
            } else {
                if (flag) {
                    var review = new Review({
                        user: req.user._id,
                        rating: req.body.review_rating,
                        review_text: req.body.review_text,
                    });

                    review.save(function (err) {
                        if (err) {
                            next(err);
                        } else {
                            Product.findOneAndUpdate({ _id: product._id }, { $push: { 'reviews': review._id } }, { new: true }, function (err) {
                                if (err) {
                                    next(err);
                                } else {
                                    res.render("product_detail", { data: product, user: req.session.user });
                                }
                            })
                        }
                    });
                }
            }
        })
}
