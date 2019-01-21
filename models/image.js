var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ImageSchema = new Schema({
    data: {type:Buffer, required: true},
    contentType: {type: String, required: true}
});

module.exports = mongoose.model('Image', ImageSchema);