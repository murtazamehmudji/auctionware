var express = require('express');
var router = express.Router();

var image_controller = require('../controllers/imageController');

//GET Image Response/File
router.get('/:id', image_controller.get_image_by_id);

module.exports = router;