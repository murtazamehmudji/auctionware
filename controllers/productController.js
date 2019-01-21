var Product = require('../models/product');
var Bid = require('../models/bid');
var User = require('../models/user');
var async = require('async');
var auth = require('./authorizationPermissions');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const bodyParser = require('body-parser');

//Display Root Home Page on GET 
exports.index = function (req, res, next) {
    Product.find({ deal_closed: false }, 'name category initial_bid highest_bid image_url')
        .limit(12)
        .exec(function (err, list_products) {
            if (err) {
                return next(err);
            }
            if (req.session.user) {
                res.render('index', { user: req.session.user, product_list: list_products });
            } else {
                res.render('index', { product_list: list_products });
            }
        });
};

// Display detail page for a specific Product on GET.
exports.product_detail = function (req, res, next) {
    Product.findById(req.params.id).exec(function (err, product) {
        if (err) {
            return next(err);
        }
        res.render('product_detail', { user: req.session.user, product: product });
    });
};

//Display category wise Products on GET
exports.product_list_categoryWise = function (req, res, next) {
    var categories = ['realestate', 'antiques', 'paintings', 'goldreserves', 'gemreserves', 'aircrafts', 'cars', 'other'];
    var categories_name = [{ name: 'Real Estate', url: 'realestate' }, { name: 'Antiques', url: 'antiques' }, { name: 'Paintings', url: 'paintings' }, { name: 'Gold Reserves', url: 'goldreserves' }, { name: 'Gem Reserves', url: 'gemreserves' }, { name: 'Aircrafts', url: 'aircrafts' }, { name: 'Cars', url: 'cars' }, { name: 'Other', url: 'other' }];
    var found = false;
    for (var i = 0; i < categories.length; i++) {
        if (req.params.id === categories[i]) {
            found = true;
            break;
        }
    }
    if (found) {
        Product.find({ deal_closed: false, category: req.params.id }, 'name category initial_bid highest_bid image_url url')
            .exec(function (err, list_products) {
                if (err) {
                    return next(err);
                }
                res.render('category', { user: req.session.user, category: categories_name[i].name, product_list: list_products });
            });
    }
};

// Display Product create form on GET.
exports.product_create_get = [
    auth.checkSignIn,
    function (req, res) {
        res.render('new_product', { user: req.session.user })
    }];

// Handle Product create on POST.
exports.product_create_post = [auth.checkSignIn,

    //validate if the fields are not empty and are required
    body('productName').exists().isLength({ min: 1 }).trim(),
    body('initialBid').exists().isDecimal({ force_decimal: false, decimal_digits: '1,2', locale: 'en-US' }).trim(),
    body('category').exists().isIn(['realestate', 'antiques', 'paintings', 'goldreserves', 'gemreserves', 'aircrafts', 'cars', 'other']),
    body('productDescription').exists(),
    body('image').exists(),

    //Sanitize (trim and escape)
    body('productName').trim().escape(),
    body('initialBid').trim().escape(),
    body('category').trim().escape(),
    body('productDescription').trim().escape(),

    function (req, res, next) {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('new_product', { errors: errors });
            return;
        }

        User.findById(req.session.user._id).exec(function (err, user) {
            if (err) {
                return next(err);
            }
            var imagedetail = {
                data: req.body.image,
                contentType: 'image/jpg'
            }
            var image = new Image(imagedetail);
            image.save(function (err) {
                if (err) {
                    next(err);
                } else {
                    // Was an image uploaded? If so, we'll use its public URL
                    // in cloud storage.
                    var productDetail = {
                        name: req.body.productName,
                        initial_bid: req.body.initialBid,
                        category: req.body.category,
                        detail: req.body.productDescription,
                        images: image._id,
                        owner: user
                    }
                    var product = new Product(productDetail);
                    product.save(function (err) {
                        if (err) {
                            return next(err);
                        }
                        var url = '/product/' + product._id;
                        res.redirect(url);
                    });
                }
            });
        });
    }];

// Handle Product delete on POST.
exports.product_delete_post = [auth.checkSignIn, function (req, res, next) {
    Product.findById(req.params.id).populate('owner').exec(function(err, product){
        if(err){return next(err);}
        if(product.owner._id == req.session.user._id){
            Bid.find({
                'product': product._id
            }).exec(function(err, bids){
                if(err) return next(err);
                if(bids){
                    var bidDelete = [];
                    for (var i = 0; i < bids.length; i++) {
                        bidDelete.push((function (i, bid) {
                            //We are returning the actual task function here with enclosed scope containing 'i'
                            return function(callback){
                                console.log(bid._id);
                                Bid.findByIdAndRemove(bid._id).exec(function (err, bid) {
                                    if (err) {
                                        return next(err);
                                    }
                                    console.log('Bid Removed ' + bid);
                                    callback(null, bid);
                                });
                            }
                        })(i, bids[i]));
                    };
                    async.series(
                        bidDelete,
                        function(err, result){
                            Product.findByIdAndRemove(req.params.id, function(err){
                                if(err){return next(err);}
                                res.redirect('/user/auctions');
                            });
                        }
                    );
                } else {
                    console.log('no bids to delete');
                }

            });
        }
        else{
            var err = new Error('You cannot delete someone else\'s Product');
            return next(err);
        }
    })
}];

//Display User's products on GET
exports.user_products = [
    auth.checkSignIn,
    function (req, res, next) {
        Product.find({ owner: req.session.user._id }, 'name initial_bid highest_bid image_url deal_closed')
            .exec(function (err, list_products) {
                if (err) {
                    return next(err);
                }
                res.render('your_auctions', { user: req.session.user, category: 'Your Auctions', product_list: list_products });
            });
    }];
