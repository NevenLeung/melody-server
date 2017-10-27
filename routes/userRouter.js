/**
 * Created by Administrator on 2017/10/12.
 */
const express = require('express');
const passport = require('passport');
const Users = require('../models/users');
const Verify = require('./verify');

const router = express.Router();

/* GET users listing. */
router.route('/')
    .get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, (req, res, next) => {
        Users.find(req.query)
            .select('_id username avatar introduction favorites updatedAt createdAt')
            .exec((err, users) => {
                if (err) {
                    console.log('err: ' + err);
                    next(err);
                }
                res.json({
                    total: users.length,
                    data: users
                });
        })
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, (req, res, next) => {
        Users.remove({}, (err, resp) => {
            if (err) {
                console.log('err: ' + err);
                next(err);
            }
            res.json(resp);
        });
    });

router.post('/register', (req, res) => {
    Users.register(new Users({
        username: req.body.username,
        avatar: req.body.avatar,
        introduction: req.body.introduction,
        admin: req.body.admin
    }), req.body.password, (err, user) => {
        if(err) {
            return res.status(500).json({err: err});
        }

        user.save((err, user) => {
            passport.authenticate('local')(req, res, () => {
                return res.status(200).json({
                    status: 'Registration Success'
                });
            });
        });
    });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err) {
            return next(err);
        }

        if(!user) {
            return res.status((401)).json({
                err: info
            });
        }

        req.login(user, (err) => {
            if(err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }

            var token = Verify.getToken({
                'username': user.username,
                '_id': user._id,
                'admin': user.admin
            });

            res.status(200).json({
                message: 'Login successful!',
                success: true,
                id: user._id,
                token: token,
                avatar: user.avatar
            });
            // res.json(user);
        });
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.status(200).json({
        message: 'Bye!'
    });
});

// route for specified user id
router.route('/:id')
    .get((req, res, next) => {
        Users.findById(req.params.id)
            .select('_id username avatar introduction favorites updatedAt createdAt')
            .exec((err, user) => {
                if (err) {
                    console.log('err: ' + err);
                    next(err);
                }
                res.json(user);
            });
    })

    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, (req, res, next) => {
        Users.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
            new: true
        }).select('_id username avatar introduction favorites updatedAt createdAt')
           .exec((err, user) => {
                if (err) {
                    console.log('err: ' + err);
                    next(err);
                }
                res.json(user);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, (req, res, next) => {
        Users.findByIdAndRemove(req.params.id)
            .select('_id username avatar introduction favorites updatedAt createdAt')
            .exec((err, resp) => {
                if (err) {
                    console.log('err: ' + err);
                    next(err);
                }
                res.json(resp);
        });
    });

// for the favorite list operation
// get user info and his/her favorite list
router.route('/:id/favorites')
    .get((req, res, next) => {
        Users.findById(req.params.id)
            .select('_id username avatar introduction favorites updatedAt createdAt')
            .populate('favorites.songInfo','_id title artist artistID time url albumCover albumName')
            .exec((err, user) => {
                if (err) {
                    console.log('err: ' + err);
                    next(err);
                }
                res.json(user);
            });
    })
    // set his/her favorite list to empty
    .delete(Verify.verifyOrdinaryUser, (req, res, next) => {
        Users.findByIdAndUpdate(req.params.id, {
            $set: {
                favorites: []
            }
        }, {
            new: true
        })
            .select('_id username avatar introduction favorites updatedAt createdAt')
            .exec((err, user) => {
                if (err) {
                    console.log('err: ' + err);
                    next(err);
                }
                res.json(user);
        });
    });

// route for updating favorite list in sub document of User model
router.route('/:id/favorites/:songID')
    .put(Verify.verifyOrdinaryUser, (req, res, next) => {
        Users.findById(req.params.id)
            .select('_id username avatar introduction favorites updatedAt createdAt')
            .exec((err, user) => {
                if (err) {
                    console.log('err' + err);
                    next(err);
                }

                // find the id sub document
                let flag = true;
                user.favorites.forEach((item) => {
                    if (item.songInfo == req.params.songID) {
                        flag = false;
                    }
                });

                if (flag) {
                    user.favorites.push({songInfo:req.params.songID});
                    user.save((err, user) => {
                        if (err) {
                            console.log('err' + err);
                            next(err);
                        }
                        console.log('favList has been updated!');
                        res.json(user);
                    });
                } else {
                    res.json({
                        message: req.params.songID + ' is already in favList!'
                    });
                }
        });
    })

    .delete(Verify.verifyOrdinaryUser, (req, res, next) => {
        Users.findById(req.params.id)
            .select('_id username avatar introduction favorites updatedAt createdAt')
            .exec((err, user) => {
                if (err) {
                    console.log('err' + err);
                    next(err);
                }

                // find the id sub document
                let id;
                user.favorites.forEach((item) => {
                    if (item.songInfo == req.params.songID) {
                        id = item._id;
                    }
                });

                user.favorites.id(id).remove();
                user.save((err, user) => {
                    if (err) {
                        console.log('err' + err);
                        next(err);
                    }
                    console.log('A song has been removed from favList');
                    res.json(user);
                })
        });
    });

module.exports = router;
