/**
 * Created by shahal on 10/8/15.
 */

var express = require('express');


var router = express.Router();

router.use('/feed', require('./feed'));


module.exports = router;