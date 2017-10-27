/**
 * Created by Administrator on 2017/10/11.
 */

// used to create, sign, and verify tokens
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey, {
        expiresIn: 3600
    });
};

exports.verifyOrdinaryUser = (req, res, next) => {
    // check header or url parameters or post parameters for token

    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        jwt.verify(token, config.secretKey, (err, decoded) => {
            if (err) {
                let err = new Error('You are not authenticated.');
                err.status = 401;
                return next(err);
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        })
    } else {
        // if there is no token
        // return an error

        // let err = new Error('No token provided!');
        // err.status = 403;
        // return next(err);

        return res.status(403).json({
            msg: 'No token provided!',
            error: {
                status: 403
            }
        })
    }
};

exports.verifyAdmin = (req, res, next) => {
    if (req.decoded.admin) {
        next();
    } else {
        let err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        return next(err);
    }
};