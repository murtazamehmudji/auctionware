<<<<<<< HEAD
=======


>>>>>>> 44ed473bf71ace3b0ba937cb485897f17c7719a5
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BidSchema = new Schema(
  {
    amount: {type: Number, required: true},
    product: {type: Schema.ObjectId, ref: 'Product', required: true},
    user: {type: Schema.ObjectId, ref: 'User', required: true}
  }
);

//Export model
module.exports = mongoose.model('Bid', BidSchema);
