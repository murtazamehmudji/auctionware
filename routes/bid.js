/* © Mufaddal Kamri */

var express = require('express');
var router = express.Router();

var product_controller = require('../controllers/productController');
var bid_controller = require('../controllers/bidController');
var user_controller = require('../controllers/userController');

//Handle bid delete on POST
router.post('/:id/delete', bid_controller.bid_delete_post);

module.exports = router;