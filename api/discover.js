/**
 * Created by shahal on 10/8/15.
 */

/**
 * Created by shahal on 10/8/15.
 */

var express = require('express');
var Challenge = require('../db').Challenge;
var filterUserData = require('../helpers/filter_user_data');


var router = express.Router();

router.post('/', function(req, res) {
    Challenge.find({status: 'active'}, function(err, activeChallenges) {
        if(err) {
            console.log('An error has occurred while trying to get the discover', err);

            res.status(500).send({
                error: 'Internal server error'
            });

            return;
        }

        activeChallenges.forEach(function(challenge) {
            // TODO: filter challenges that were pledged by this user, or challenges that this user participates in
            challenge.creator = filterUserData(challenge.creator);
        });

        res.send({challenges: activeChallenges});
    });
});


module.exports = router;