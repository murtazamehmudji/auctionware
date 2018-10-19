/* © Mufaddal Kamri */

var express = require('express');
var router = express.Router();

var product_controller = require('../controllers/productController');
var bid_controller = require('../controllers/bidController');
var user_controller = require('../controllers/userController');


//Display profile update page on GET
router.get('/updateprofile', user_controller.user_update_get);

//Handle profile update on POST
router.post('/updateprofile', user_controller.user_update_post);

//Display list of user's auction on GET
router.get('/auctions', product_controller.user_products);

//Display user's bid on GET
router.get('/bids', bid_controller.user_bids);

module.exports = router;