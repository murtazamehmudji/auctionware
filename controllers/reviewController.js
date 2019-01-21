var passport = require('passport');
var Review = require('../models/review');
var User = require('../models/user');
var Product = require('../models/product');
var auth = require('./authorizationPermissions');

exports.post_review = [auth.checkSignIn , function (req, res, next) {
    //check if the user has already reviewed
    Product.findOne({ _id: req.params.id }).populate({
        path: 'reviews',
        populate: {
            path: 'user',
            model: 'User'
        }
    }).exec(function (err, product) {
        if (err) {
            next(err);
        } else {
            var review = new Review({
                user: req.session.user._id,
                query: req.body.query,
            });

            review.save(function (err) {
                if (err) {
                    next(err);
                } else {
                    Product.findOneAndUpdate({ _id: product._id }, { $push: { 'reviews': review._id } }, { new: true }, function (err) {
                        if (err) {
                            next(err);
                        } else {
                            res.redirect('/product/'+product._id);                   
                        }
                    })
                }
            });
        }
    })
}]
