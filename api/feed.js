/**
 * Created by shahal on 10/8/15.
 */

var express = require('express');
var Challenge = require('../db').Challenge;
var filterUserData = require('../helpers/filter_user_data');


var router = express.Router();

router.post('/', function(req, res) {
    Challenge.find({status: 'completed'}).sort({creation_date: 'ascending'}).exec(function(err, completedChallenges) {
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

        // TODO: filter participants user data

        res.send({challenges: completedChallenges});
    });
});


module.exports = router;