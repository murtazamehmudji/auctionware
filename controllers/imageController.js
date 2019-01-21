var Image = require('../models/image');

exports.get_image_by_id = function(req, res, next){
    //res.send('url: ' + req.url + '\nSend Image Buffer as response and contentType as any image type (matlab ki image/png or image/jpg)');
    Image.findById(req.params.id).exec(function(err, image){
        if(err){
            next(err);
        } else {
            res.status(200).contentType(image.contentType).send(image.data);
        }
    });
}