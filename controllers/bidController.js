var Product = require('../models/product');
var Bid = require('../models/bid');
var User = require('../models/user');
var async = require('async');
var auth = require('./authorizationPermissions');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Handle bid create on POST.
exports.bid_create_post = [auth.checkSignIn,
//Validate
body('bid_amount').exists().isDecimal({ force_decimal: false, decimal_digits: '1,2', locale: 'en-US' }).trim(),
//Sanitize
body('initialBid').trim().escape(),

function (req, res, next) {
    //Extract Validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('product_detail', { user: req.session.user, errors: errors });
        return;
    }
    Product.findById(req.params.id).exec(function (err, product) {
        if (err) { return next(err); }
        if (product == null) {
            var err = new Error('No Such Product');
            return next(err);
        }
        var bidDetail = {
            amount: req.body.bid_amount,
            product: product,
            user: req.session.user,
        }
        var bid = new Bid(bidDetail);
        bid.save(function (err) {
            if (err) { return next(err); }
        });
        if (req.body.bid_amount > product.highest_bid) {
            var newProduct = new Product({
                name: product.name,
                category: product.category,
                initial_bid: product.initial_bid,
                highest_bid: req.body.bid_amount,
                deal_closed: false,
                image_url: product.image_url,
                detail: product.detail,
                owner: product.owner,
                _id: product._id
            });
            Product.findByIdAndUpdate(req.params.id, newProduct, function (err, product) {
                if (err) { return next(err); }
                res.redirect('/user/bids');
            });
        }
    });
}];

// Handle bid delete on POST.
exports.bid_delete_post = [
    auth.checkSignIn,
    function (req, res, next) {

        async.waterfall([
            function (callback) {
                Bid.findById(req.params.id).populate('product').exec(function (err, bid) {
                    callback(null, bid);
                })
            },
            function (bid, callback) {
                Product.findById(bid.product._id).exec(function (err, product) {
                    var result = {
                        bid: bid,
                        product: product
                    }
                    callback(null, result);
                })
            },
            function (result, callback) {
                if (result.bid.amount === result.product.highest_bid) {
                    async.waterfall([
                        function (callback) {
                            Bid.find({ product: result.product }).populate('product').sort({ amount: -1 }).exec(function (err, bid_list) {
                                if(err) return next(err);
                                if(bid_list.length === 1){
                                    var interBid = {
                                        amount: 0,
                                        product: {
                                            _id: bid_list[0].product._id
                                        }
                                    }
                                    callback(null, interBid);
                                } else{
                                    callback(null, bid_list[1]);
                                }
                            })
                        },
                        function (second_highest_bid, callback) {
                            var productDetail = {
                                highest_bid: second_highest_bid.amount,
                            }
                            Bid.findByIdAndRemove(req.params.id, function (err) {
                                if (err) { return next(err); }
                            });
                            Product.findByIdAndUpdate(second_highest_bid.product._id, productDetail, {new: true}, function (err, product) {
                                if (err) { return next(err); }
                                callback(null, product);
                            });
                        }
                    ], function (err, result) {
                        if(err) return next(err);
                        res.redirect('/user/bids');
                    });
                } else {
                    Bid.findByIdAndRemove(req.params.id, function (err) {
                        if (err) { return next(err); }
                    });
                    res.redirect('/user/bids');
                }
            }
        ], function (err, result) {
            if (err) { return next(err) }
        });
    }
];

//Handle Product accept bid on POST
exports.product_accept_bid = [
    auth.checkSignIn,
    function (req, res, next) {
        async.waterfall([
            function (callback) {
                Product.findById(req.params.id).populate('owner').exec(function (err, product) {
                    if (err) { return next(err); }
                    callback(null, product);
                });
            },
            function (product, callback) {
                if(product.highest_bid === 0){
                    var err = new Error('No Bid to Accept');
                    return next(err);
                } else {
                    var productDetail = {
                        name: product.name,
                        category: product.category,
                        initial_bid: product.initial_bid,
                        highest_bid: product.highest_bid,
                        deal_closed: true,
                        image_url: product.image_url,
                        detail: product.detail,
                        owner: product.owner,
                        _id: product._id
                    }
                    var newProduct = new Product(productDetail);
                    Product.findByIdAndUpdate(product._id, newProduct, function (err, product) {
                        if (err) { return next(err); }
                        callback(null, product);
                    });
                    res.redirect('/user/auctions');
                }
            }
        ]);
    }];

//Display User Bids on GET
exports.user_bids = [
    auth.checkSignIn,
    function (req, res, next) {
        Bid.find({ user: req.session.user._id }, 'amount product user')
            .populate('product')
            .exec(function (err, list_bids) {
                if (err) {
                    return next(err);
                }
                res.render('your_bids', { user: req.session.user, category: 'Your Bids', bid_list: list_bids });
            });
    }];
