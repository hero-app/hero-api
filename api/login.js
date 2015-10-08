/**
 * Created by shahal on 10/8/15.
 */

var express = require('express');
var request = require('request');
var util = require('util');
var generateUserKey = require('../helpers/generate_user_key');
var User = require('../db/index').User;


var router = express.Router();

router.post('/', function(req, res) {
    var facebookAccessToken = req.body.facebook_access_token;

    // Data about the user to retrieve from the Facebook API
    var fields = [
        'id',
        'name',
        'location',
        'picture'
    ];

    var url = util.format('https://graph.facebook.com/me?access_token=%s&fields=%s', facebookAccessToken, fields.join(','));

    request(url, function (error, response, body) {
        // In case of error
        if (error || response.statusCode !== 200) {
            var errorMessage = 'An error has occurred while trying to authenticate your user with facebook';

            console.log(errorMessage, 'Provided access token:', facebookAccessToken);

            res.status(500).send({
                error: errorMessage
            });

            return;
        }


        // *** No error - Register the user in Hero's database *** //

        var facebookUser = JSON.parse(body);

        console.log('Facebook user received', facebookUser);

        User.findOne({fbid: facebookUser.id}, function(err, user) {
            if(err) {
                console.log('An error has occurred while trying to get a user from the database by FBID', facebookUser.id);

                res.status(500).send({
                    error: 'Internal server error'
                });

                return;
            }

            // Create user if there's no registered user with that Facebook ID
            if(!user) {
                // Generate the user's unique key
                var userKey = generateUserKey(facebookUser.id.toString());

                console.log('Generated a unique key for user', userKey);

                User.create({
                    key: userKey,
                    fbid: facebookUser.id.toString(),
                    name: facebookUser.name,
                    image: facebookUser.picture.data.url,
                    location: facebookUser.location
                }, function(err, createdUser) {
                    if(err) {
                        console.log('An error has occurred while trying to create a new user', err);

                        res.status(500).send({
                            error: 'Internal server error'
                        });

                        return;
                    }

                    console.log('Created a new user!', createdUser);

                    res.send(createdUser);
                });
            } else {
                console.log('There is a user associated with this facebook ID. Doing nothing...');

                res.send(user);
            }
        });
    });
});


module.exports = router;