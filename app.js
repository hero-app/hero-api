/**
 * Created by shahal on 10/8/15.
 */

var express = require('express');
var bodyParser = require('body-parser');


var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(function(req, res, next) {
    console.log('Got request for', req.originalUrl);
    next();
});

app.use('/', require('./api'));

// Invalid path default error message
app.use(function(req, res) {
    res.status(500).send({
        error: 'Invalid path'
    });
});


var port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log('*** Hero is listening on port', port, '***');
});