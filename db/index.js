/**
 * Created by shahal on 10/8/15.
 */

var mongoose = require('mongoose');


var connectionString = 'mongodb://hero:BattleHack2015@candidate.53.mongolayer.com:10454,candidate.54.mongolayer.com:10195/hero?replicaSet=set-5616b6a0d55e3ef8c00004a4';

mongoose.connect(connectionString, function(err) {
     if(err) {
         console.log('Unable to connect to MongoDB', err);
     }
});


mongoose.connection.on('error', function(err) {
    console.log('An error has occurred in mongoose connection', err);
});


module.exports.User = mongoose.model('User', require('./models/user'));
module.exports.Challenge = mongoose.model('Challenge', require('./models/challenge'));