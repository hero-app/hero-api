/**
 * Created by shahal on 10/8/15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var challengeSchema = new Schema({
    status              : String, // active | completed
    title               : String,
    description         : String,
    rules               : String,
    creator             : Object,
    creation_date       : Number,
    category            : String,
    image               : String,
    participants        : Array,
    fund_goal           : Number,
    charity_percentage  : Number
});


module.exports = challengeSchema;