/**
 * Created by shahal on 10/8/15.
 */

var express = require('express');
var braintree = require('braintree');

var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: '2v3wv88pj627b726',
    publicKey: 'vr6zqs843xdtyffk',
    privateKey: '647c71ab04e136704f7a86ac2bbcd5d7'
});


var router = express.Router();

router.post('/client_token', function(req, res) {
    // TODO: User authentication

    gateway.clientToken.generate({}, function (err, response) {
        if(err) {
            console.log('An error has occurred while trying to generate a client token for payment', err);

            res.status(500).send({
                error: 'Internal server error'
            });

            return;
        }

        res.send({client_token: response.clientToken});
    });
});


module.exports = router;
