/*
 * Jeni Lane
 * Carina Take-Home Interview
 * 11/18/2020
 */

let jwt = require('jsonwebtoken'); // Import JWT
let config = {
    secret: process.env.JSON_WEB_TOKEN  // key used for generating and validating the JSON web tokens
};

// Checks given JSON web token to see if it is valid and has proper authorization
let checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];


    if (token) {
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }

        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Token is not valid'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }
};

module.exports = {
    checkToken: checkToken
}