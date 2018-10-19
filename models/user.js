var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        first_name: {type: String, required: true, max: 100},
        last_name: {type: String, required: true, max: 100},
        email: {type: String, required: true},
        mobile: {type: Number, required: true},
        password: {type: String, required: true}
    }
);

//Virtual for user's  URL
UserSchema
.virtual('url')
.get(function(){
    return '/user/' + this._id;
});

//Export model
module.exports = mongoose.model('User', UserSchema);