var express = require('express');
var router = express.Router();

var product_controller = require('../controllers/productController');
var bid_controller = require('../controllers/bidController');
var user_controller = require('../controllers/userController');

//Display root home page on GET
router.get('/', product_controller.index );

//Display signup on GET
router.get('/signup', user_controller.user_create_get);

//Handle signup on POST
router.post('/signup', user_controller.user_create_post);

//Handle signin on POST
router.post('/signin', user_controller.user_signin_post);

//Handle signout on GET
router.get('/signout', user_controller.user_signout_get);

module.exports = router;
