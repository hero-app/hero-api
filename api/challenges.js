/**
 * Created by shahal on 10/8/15.
 */

var express = require('express');
var Challenge = require('../db').Challenge;
var User = require('../db').User;
var filterUserData = require('../helpers/filter_user_data');
var braintree = require('braintree');

var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: '2v3wv88pj627b726',
    publicKey: 'vr6zqs843xdtyffk',
    privateKey: '647c71ab04e136704f7a86ac2bbcd5d7'
});


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
            backers: challengeData.backers || [] // Should be empty by default, but allows overriding for presentation purposes
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

router.post('/:id/pledge', function(req, res) {
    var amount = req.body.amount;
    var key = req.body.key;
    var challengeId = req.params.id;
    var nonce = req.body.nonce;

    User.findOne({key: key}, function(err, user) {
        if(err) {
            console.log('An error has occurred while trying to find a user with key', key);

            res.status(500).send({
                error: 'Internal server error'
            });

            return;
        }

        if(!user) {
            console.log('An unregistered user cannot pledge to a challenge.', 'Bad key:', key);

            res.status(500).send({
                error: 'Internal server error'
            });

            return;
        }

        Challenge.findById(challengeId, function(err, challenge) {
            if(err) {
                console.log('An error has occurred while trying to get a challenge.', 'Challenge ID:', challengeId);

                res.status(500).send({
                    error: 'Internal server error'
                });

                return;
            }

            if(!challenge) {
                console.log('Cannot pledge to an invalid challenge.', 'Invalid challenge ID:', challenge);

                res.status(500).send({
                    error: 'Cannot pledge to an invalid challenge'
                });

                return;
            }

            if(challenge.status !== 'active') {
                console.log('Cannot pledge to an inactive challenge');

                res.status(500).send({
                    error: 'Cannot pledge to an inactive challenge'
                });

                return;
            }

            if(hasUserPledgedChallenge(user, challenge)) {
               console.log('Cannot pledge a challenge twice.', 'User key:', key, 'Challenge ID:', challengeId);

                res.status(500).send({
                    error: 'Cannot pledge a challenge twice'
                });

                return;
            }

            // *** All good - Ready to update the challenge with the new pledge *** //

            gateway.transaction.sale({
                amount: amount,
                paymentMethodNonce: nonce
            }, function(err, result) {
                if(err) {
                    console.log('An error has occurred while trying to commit the transaction.', 'Challenge ID:', challengeId, 'User key:', user.key);

                    res.status(500).send({
                        error: 'Internal server error'
                    });

                    return;
                }

                console.log('Successful payment.', 'Amount:', amount, 'Challenge ID:', challengeId, 'User key:', key);

                var backers = challenge.backers;
                backers.push({
                    user: user,
                    amount: amount
                });

                Challenge.update({_id: challenge.id}, {$set: {backers: backers}}, function(err) {
                    if(err) {
                        // TODO: Refund customer

                        console.log('An error has occurred while trying to save a challenge after a pledge', err);

                        res.status(500).send({
                            error: 'Internal server error'
                        });

                        return;
                    }

                    res.send({
                        success: true
                    });
                });
            });
        });
    });
});

function hasUserPledgedChallenge(user, challenge) {
    for(var i = 0; i < challenge.backers.length; i++) {
        if(user.key === challenge.backers[i].user.key) {
            return true;
        }
    }
}

module.exports = router;