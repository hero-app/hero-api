/**
 * Created by shahal on 10/8/15.
 */

var express = require('express');
var Challenge = require('../db').Challenge;
var filterUserData = require('../helpers/filter_user_data');


var router = express.Router();

router.post('/', function(req, res) {
    Challenge.find({status: 'completed'}, function(err, completedChallenges) {
        if(err) {
            console.log('An error has occurred while trying to get the feed', err);

            res.status(500).send({
                error: 'Internal server error'
            });

            return;
        }

        completedChallenges.forEach(function(challenge) {
            challenge.creator = filterUserData(challenge.creator);
        });

        res.send(completedChallenges);
    });
});


module.exports = router;