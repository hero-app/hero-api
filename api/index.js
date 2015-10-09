/**
 * Created by shahal on 10/8/15.
 */

var express = require('express');


var router = express.Router();

router.get('/', function(req, res) {
    res.send('hello');
});
router.use('/login', require('./login'));
router.use('/challenges', require('./challenges'));
router.use('/feed', require('./feed'));
router.use('/discover', require('./discover'));
router.use('/payment', require('./payment'));


module.exports = router;