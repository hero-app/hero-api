/**
 * Created by shahal on 10/8/15.
 */

var mongoose = require('mongoose');


var connectionString = 'mongodb://hero:BattleHack2015@ds035014.mongolab.com:35014/hero';

mongoose.connect(connectionString, function(err) {
     if(err) {
         console.log('Unable to connect to MongoDB', err);
     }
});


mongoose.connection.on('error', function(err) {
    console.log('An error has occurred in mongoose connection', err);
});


module.exports.User = mongoose.model('User', require('./models/user'));