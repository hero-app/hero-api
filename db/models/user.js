/**
 * Created by shahal on 10/8/15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
    key     : String,
    fbid    : Number,
    name    : String,
    image   : String,
    location: String
});


module.exports = userSchema;