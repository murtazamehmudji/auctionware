var express = require('express');
var router = express.Router();

var product_controller = require('../controllers/productController');
var bid_controller = require('../controllers/bidController');
var user_controller = require('../controllers/userController');
var review_controller = require('../controllers/reviewController');

//Display auctions category wise on GET
router.get('/category/:id/', product_controller.product_list_categoryWise);

//Display New auction form on GET
router.get('/newauction', product_controller.product_create_get);

//Handle New auction form on POST
router.post('/newauction', product_controller.product_create_post);

//Display particular product detail page on GET
router.get('/:id/', product_controller.product_detail);

//Handle new bid create on POST
router.post('/:id/newbid', bid_controller.bid_create_post);

//Handle accept bid on POST
router.post('/:id/acceptbid', bid_controller.product_accept_bid);

//Handle delete product on POST
router.post('/:id/delete', product_controller.product_delete_post);

//AJAX response for contact owner on GET
router.get('/:id/contactbuyer', user_controller.product_highBid_detail);

//AJAX response for contact buyer on GET
router.get('/:id/contactowner', user_controller.product_owner_detail);

router.post('/:id/review', review_controller.post_review);

module.exports = router;
