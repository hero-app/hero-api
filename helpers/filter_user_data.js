/**
 * Created by shahal on 10/8/15.
 */

module.exports = function(user) {
    return {
        fbid: user.fbid,
        name: user.name,
        image: user.image,
        location: user.location
    };
};