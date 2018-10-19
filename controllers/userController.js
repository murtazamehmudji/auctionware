var Product = require('../models/product');
var Bid = require('../models/bid');
var User = require('../models/user');
var auth = require('./authorizationPermissions');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const Sendgrid = require('sendgrid')('');

// Display User create form on GET.
exports.user_create_get = function (req, res, next) {
    if (req.session.user) {
        res.redirect('/user/updateprofile');
    }
    res.render('signup');
};

// Handle User create on POST.
exports.user_create_post = [
    //validate if the fields are not empty and are required
    body('f_name', 'Please Enter First Name').exists().isLength({ min: 1 }).trim(),
    body('l_name', 'Please Enter Last Name').exists().isLength({ min: 1 }).trim(),
    body('email', 'Please Enter a valid E-mail Address').exists().isEmail().trim(),
    body('mobile', 'Please Enter a valid Indian Mobile Number').exists().isMobilePhone('en-IN'),
    body('password', 'Password must have arleast 8 characters').exists(),

    //Sanitize (trim and escape)
    body('*').trim().escape(),

    function (req, res, next) {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('signup', { errors: errors });
        }
        else {
            User.findOne({ 'email': req.body.email })
                .exec(function (err, found_user) {
                    if (err) { next(err); }
                    if (found_user) {
                        err = new Error("User Exist");
                        return next(err);
                    }
                    else {
                        var userdetail = {
                            first_name: req.body.f_name,
                            last_name: req.body.l_name,
                            email: req.body.email,
                            mobile: req.body.mobile,
                            password: req.body.password
                        }
                        var user = new User(userdetail);

                        user.save(function (err) {
                            if (err) { return next(err); }
                            req.session.user = user;;
                            res.redirect('/');
                        });
                    }
                });
        }

    }];

// Display User update form on GET.
exports.user_update_get = [auth.checkSignIn, function (req, res, next) {
    User.findById(req.session.user._id).exec(function (err, user) {
        if (err) {
            next(err);
            return;
        }
        res.render('update_profile', { userDetail: user, user: user });
    });
}];

// Handle User update on POST.
exports.user_update_post = [
    auth.checkSignIn,
    //validate if the fields are not empty and are required
    body('f_name', 'Please Enter First Name').exists().isLength({ min: 1 }).trim(),
    body('l_name', 'Please Enter Last Name').exists().isLength({ min: 1 }).trim(),
    body('email', 'Please Enter a valid E-mail Address').exists().isEmail().trim(),
    body('mobile', 'Please Enter a valid Indian Mobile Number').exists().isMobilePhone('en-IN'),
    body('password', 'Password must have arleast 8 characters').exists(),

    //Sanitize (trim and escape)
    body('*').trim().escape(),

    function (req, res, next) {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        var user = new User({
            first_name: req.body.f_name,
            last_name: req.body.l_name,
            email: req.body.email,
            mobile: req.body.mobile,
            password: req.body.password,
            _id: req.session.user._id
        });
        var updated = false;
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('update_profile', { user: user, errors: errors });
            return;
        }
        else {
            updated = User.findByIdAndUpdate(req.session.user._id, user, function (err, user) {
                if (err) { return next(err); }
                else {
                    return true;
                }
            });
        }
        res.render('update_profile', { updated: updated, userDetail: user, user: user });
    }];

//Display Product Owner Detail of specific Product
exports.product_owner_detail = [
    auth.checkSignIn,
    function (req, res, next) {
        Product.findById(req.params.id).populate('owner').exec(function (err, product) {
            if (err) { return next(err); }
            User.findById(product.owner._id).exec(function (err, owner) {
                if (err) { return next(err); }
                res.render('owner_buyer', { detailSent: true, owner: owner, user: req.session.user });                
                // var detailSent = false;
                // var mailContent = "<!DOCTYPE html><html lang=\"en\"><head><title>Online Auction System</title></head><body><h1>Product Details on which you bid</h1><h2>Product Name: "+product.name+"</h2><img style=\"height:200px;\" src=\""+product.image_url+"\"><h2>Initial Bid: "+product.initial_bid+"</h2><h2>Highest Bid: "+product.highest_bid+"</h2><h1>Product's Owner's Details</h1><h2>Name: " + owner.first_name + " " + owner.last_name + "</h2><h2>Mobile: " + owner.mobile + "</h2><h2>Email: <a href=\"mailto:" + owner.email + "\">" + owner.email + "</a></h2></body></html>"                
                // const sgReq = Sendgrid.emptyRequest({
                //     method: 'POST',
                //     path: '/v3/mail/send',
                //     body: {
                //         personalizations: [{
                //             to: [{ email: req.session.user.email }],
                //             subject: 'Owner Details'
                //         }],
                //         from: { email: 'noreply@onlineauctionsystem.mufaddalkamri.com' },
                //         content: [{
                //             type: 'text/html',
                //             value: mailContent
                //         }]
                //     }
                // });

                // Sendgrid.API(sgReq, (err) => {
                //     if (err) {
                //         next(err);
                //         return;
                //     }
                //     detailSent = true;
                //     // Render the index route on success
                //     res.render('owner_buyer', { detailSent: detailSent, owner: owner, user: req.session.user });
                //     return;
                // });
            });
        });
    }];

//Display Product Highest Bidder Detail of specific Product
exports.product_highBid_detail = [
    auth.checkSignIn,
    function (req, res, next) {
        Product.findById(req.params.id).exec(function (err, product) {
            if (err) { return next(err); }
            Bid.find({ product: product }).populate('user').sort({ amount: -1 }).exec(function (err, bids) {
                if (err) { return next(err); }
                res.render('owner_buyer', { detailSent: true, buyer: bids[0].user, user: req.session.user });                
                // var detailSent = false;
                // var mailContent = "<!DOCTYPE html><html lang=\"en\"><head><title>Online Auction System</title></head><body><h1>Your Product Details</h1><h2>Product Name: "+product.name+"</h2><img style=\"height:200px;\" src=\""+product.image_url+"\"><h2>Initial Bid: "+product.initial_bid+"</h2><h2>Highest Bid: "+product.highest_bid+"</h2><h1>Your Product's Highest Bidder Details</h1><h2>Name: " + bids[0].user.first_name + " " + bids[0].user.last_name + "</h2><h2>Mobile: " + bids[0].user.mobile + "</h2><h2>Email: <a href=\"mailto:" + bids[0].user.email + "\">" + bids[0].user.email + "</a></h2></body></html>"
                // const sg2Req = Sendgrid.emptyRequest({
                //     method: 'POST',
                //     path: '/v3/mail/send',
                //     body: {
                //         personalizations: [{
                //             to: [{ email: req.session.user.email }],
                //             subject: 'Highest Bidder Details'
                //         }],
                //         from: { email: 'noreply@onlineauctionsystem.mufaddalkamri.com' },
                //         content: [{
                //             type: 'text/html',
                //             value: mailContent
                //         }]
                //     }
                // });
                
                // Sendgrid.API(sg2Req, (err) => {
                //     if (err) {
                //         next(err);
                //         return;
                //     }
                //     detailSent = true;
                //     // Render the index route on success
                //     res.render('owner_buyer', { detailSent: detailSent, buyer: bids[0].user, user: req.session.user });
                //     return;
                // });
            });
        });
    }];

//user signin post
exports.user_signin_post = [
    //validate if the fields are not empty and are required
    body('email').exists().isEmail().trim(),
    body('password').exists(),

    //Sanitize (trim and escape)
    body('*').trim().escape(),

    function (req, res, next) {
        if (req.session.user) {
            res.redirect('/');
        }
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.redirect('/');
            return;
        }
        User.findOne({ email: req.body.email }).exec(function (err, user) {
            if (err) { return next(err); }
            if (user) {
                if (user.password === req.body.password) {
                    req.session.user = user;
                    res.redirect('/');
                } else {
                    var err = new Error('Password Incorrect');
                    return next(err);
                }
            }
            else {
                var err = new Error('Email Incorrect');
                return next(err);
            }
        });
    }];

exports.user_signout_get = function (req, res, next) {
    req.session.destroy(function () {
        res.redirect('/');
    });
}
