/**
 * Created by shahal on 10/8/15.
 */

var express = require('express');
var Challenge = require('../db').Challenge;
var User = require('../db').User;
var filterUserData = require('../helpers/filter_user_data');


var router = express.Router();

router.post('/', function(req, res) {
    var key = req.body.key;
    var challengeData = req.body.challenge;

    User.findOne({key: key}, function(err, user) {
        if(err) {
            console.log('An error has occurred while trying to find a user with key', key);

            res.status(500).send({
                error: 'Internal server error'
            });

            return;
        }

        if(!user) {
            console.log('An unregistered user cannot create a challenge.', 'Bad key:', key);

            res.status(500).send({
                error: 'Internal server error'
            });

            return;
        }

        var challenge = {
            status: challengeData.status || 'active', // Should be active by default, but allows overriding for presentation purposes
            title: challengeData.title,
            description: challengeData.description,
            rules: challengeData.rules || [],
            creator: user,
            creation_date: Date.now(),
            category: challengeData.category,
            image: challengeData.image,
            participants: challengeData.participants || [], // Should be empty by default, but allows overriding for presentation purposes
            fund_goal: challengeData.fund_goal,
            charity_percentage: challengeData.charity_percentage,
            videos: challengeData.videos || [] // Should be empty by default, but allows overriding for presentation purposes
        };

        Challenge.create(challenge, function(err, createdChallenge) {
            if(err) {
                console.log('An error has occurred while trying to create a new challenge', challenge, err);

                res.status(500).send({
                    error: 'Internal server error'
                });

                return;
            }

            console.log('Successfully created a new challenge!', createdChallenge);

            createdChallenge.creator = filterUserData(createdChallenge.creator);

            res.send(createdChallenge);
        });
    });
});

router.post('/:id', function(req, res) {
    var challengeId = req.params.id;

    Challenge.findOne({_id: challengeId}, function(err, challenge) {
        // Error
        if(err) {
            console.log('An error has occurred while trying to find a challenge by ID', challengeId, err);

            res.status(500).send({
                error: 'Internal server error'
            });

            return;
        }

        // Challenge not found
        if(!challenge) {
            console.log('Could not find a challenge with ID', challengeId);

            res.status(404).send({
                error: 'Challenge not found'
            });

            return;
        }

        res.send(challenge);
    });
});


module.exports = router;