var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ReviewSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    review_text: {type: String, required: true},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Review', ReviewSchema);
