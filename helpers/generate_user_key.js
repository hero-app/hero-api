/**
 * Created by shahal on 10/8/15.
 */

var crypto = require('crypto');
var randomstring = require('randomstring');
var xor = require('bitwise-xor');


module.exports = function(strToEncrypt) {
    var salt = randomstring.generate({
        length: 12,
        charset: 'alphabetic'
    });

    var strBuffer = new Buffer(strToEncrypt);
    var saltBuffer = new Buffer(salt);

    var xorBuffer = xor(strBuffer, saltBuffer);

    return crypto.createHash('sha256').update(xorBuffer).digest('hex');
};