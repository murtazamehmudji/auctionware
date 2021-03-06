var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductSchema = new Schema(
    {
        name: {type: String, required: true},
        category: {type: String, enum: ['realestate', 'antiques', 'paintings', 'goldreserves', 'gemreserves', 'aircrafts', 'cars', 'other'], required: true, default: 'other'},
        initial_bid: {type: Number, min: 0, required: true},
        highest_bid: {type: Number, min: 0, default: 0},
        deal_closed: {type: Boolean, default: false},
        images: {type: Schema.Types.ObjectId, ref: 'Image'},
        detail: {type: String, required: true},
        owner: {type: Schema.ObjectId, ref: 'User', required: true},
        reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}],
        start_date: {type: Date, required: true, default: new Date()},
        end_date: {type: Date, required: true}
    }
);

//Virtual for product's URL
ProductSchema.virtual('url')
.get(function(){
    return "/product/" + this._id;
});

//Export model
module.exports = mongoose.model('Product', ProductSchema);
