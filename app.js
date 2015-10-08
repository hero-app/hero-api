/**
 * Created by shahal on 10/8/15.
 */

var express = require('express');
var bodyParser = require('body-parser');


var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.use('/', require('./api'));

// Invalid path default error message
app.use(function(req, res, next) {
    res.status(500).send({
        error: 'Invalid path'
    });
});


app.listen(3000, function() {
    console.log('*** Hero is listening on port 3000 ***');
});