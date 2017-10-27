/**
 * Created by Administrator on 2017/10/3.
 */

const express = require('express');

const Songs = require('../models/songs');
const Artist = require('../models/artists');
const Comments = require('../models/comments');
const Verify = require('./verify');

const router = express.Router();

router.route('/')
    .get((req, res, next) => {
        Songs.find(req.query)
            .select('title artist artistID artistName albumName albumCover url time')
            .exec((err, songs) => {
                if (err) {
                    console.log('err: ' + err);
                    next(err);
                }
                res.json({
                    total: songs.length,
                    data: songs
                });
        });
    })

    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, (req, res, next) => {
        Artist.findOne({artistName: req.body.artist}, (err, artist) => {
            if (err) {
                console.log('err: ' + err);
                next(err);
            }

            if (req.body.artistID !== '') {
                req.body.artistID = artist._id;
            }

            Songs.create(req.body, (err, song) => {
                if (err) {
                    console.log('err: ' + err);
                    next(err);
                }
                console.log('Song created!');
                res.json(song);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, (req, res, next) => {
        Songs.remove({}, (err, resp) => {
            if (err) {
                console.log('err: ' + err);
                next(err);
            }
            res.json(resp);
        });
    });

router.route('/:id')
    .get((req, res, next) => {
        Songs.findById(req.params.id, (err, song) => {
            if (err) {
                console.log('err: ' + err);
                next(err);
            }
            res.json(song);
        });
    })

    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, (req, res, next) => {
        Songs.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
            new: true
        }, (err, song) => {
            if (err) {
                console.log('err: ' + err);
                next(err);
            }
            res.json(song);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, (req, res, next) => {
        Songs.findByIdAndRemove(req.params.id, (err, resp) => {
            if (err) {
                console.log('err: ' + err);
                next(err);
            }
            res.json(resp);
        });
    });


// route for embed comment in song model.
// Due to the inconvenience of pagination of comment, move the comment to a single collection, comments

// router.route('/:id/comments')
//     .get((req, res, next) => {
//         // Songs.findById(req.params.id)
//         //     .populate('comments.postedBy', '_id username avatar')
//         //     .exec((err, song) => {
//         //         if (err) {
//         //             console.log('err: ' + err);
//         //             next(err);
//         //         }
//         //         res.json({
//         //             total: song.comments.length,
//         //             data: song.comments
//         //         });
//         //     });
//
//         Songs.paginate(
//             {
//                 _id: req.params.id
//             },
//             {
//                 // page: req.params.page,
//                 page: 1,
//                 limit: 5,
//                 populate: {
//                     // mongoose populate object
//                     path: 'comments.postedBy',
//                     select: '_id username avatar'
//                 }
//             },
//             (err, song) => {
//                 if (err) {
//                     console.log('err: ' + err);
//                     next(err);
//                 }
//                 res.json({
//                     result: song,
//                     // total: song.doc.comments.length,
//                     // data: song.doc.comments
//                 });
//             });
//     })
//
//     .post(Verify.verifyOrdinaryUser, (req, res, next) => {
//         // console.log(req.headers);
//         Songs.findById(req.params.id, (err, song) => {
//             if (err) {
//                 console.log('err: ' + err);
//                 next(err);
//             }
//             req.body.postedBy = req.decoded._id;
//             song.comments.push(req.body);
//             song.save((err, song) => {
//                 if (err) {
//                     console.log('err: ' + err);
//                     next(err);
//                 }
//                 console.log('Added comments!');
//                 res.json(song);
//             });
//         });
//     })
//
//     .delete((req, res, next) => {
//         Songs.findByIdAndUpdate(req.params.id, {
//             $set: {
//                 comments: []
//             }
//         }, {
//             new: true
//         }, (err, song) => {
//             if (err) {
//                 console.log('err: ' + err);
//                 next(err);
//             }
//             res.json(song);
//         });
//     });
//
// router.route('/:id/comments/:commentId')
//     .get((req, res, next) => {
//         Songs.findById(req.params.id)
//             .populate('comments.postedBy', '_id username avatar')
//             .exec((err, song)=> {
//                 if (err) {
//                     console.log('err: ' + err);
//                     next(err);
//                 }
//                 res.json(song.comments.id(req.params.commentId));
//             });
//     })
//
//     .put(Verify.verifyOrdinaryUser, (req, res, next) => {
//         Songs.findById(req.params.id, (err, song) => {
//             if (err) {
//                 console.log('err: ' + err);
//                 next(err);
//             }
//             song.comments.id(req.params.commentId).remove();
//             req.body.postedBy = req.decoded._id;
//             song.comments.push(req.body);
//             song.save((err, song) => {
//                 if (err) {
//                     console.log('err: ' + err);
//                     next(err);
//                 }
//                 console.log('Update Comments!');
//                 res.json(song);
//             })
//         })
//     })
//
//     .delete(Verify.verifyOrdinaryUser, (req, res, next) => {
//         Songs.findById(req.params.id, (err, song) => {
//             if (song.comments.id(req.params.commentId).postedBy !== req.decoded._id) {
//                 var error = new Error('You are not authorized to perform this operation!');
//                 error.status = 403;
//                 return next(error);
//             }
//             if (err) {
//                 console.log('err: ' + err);
//                 next(err);
//             }
//             song.comments.id(req.params.commentId).remove();
//             console.log('A comment has been deleted.');
//             song.save((err, response) => {
//                 if (err) {
//                     console.log('err: ' + err);
//                     next(err);
//                 }
//                 res.json(response);
//             });
//         });
//     });

router.route('/:songID/comments')
    .get((req, res, next) => {
        // use mongoose-paginate to implement pagination of comments
        Comments.paginate(
            {
                songID: req.params.songID
            },
            {
                page: req.query.page,
                limit: 5,
                populate: {
                    path: 'postedBy',
                    select: '_id username avatar'
                }
            },
            (err, doc) => {
                if (err) {
                    console.log('err: ' + err);
                    next(err);
                }
                res.json(doc);
            });
    })

    .post(Verify.verifyOrdinaryUser, (req, res, next) => {
        req.body.songID = req.params.songID;
        req.body.postedBy = req.decoded._id;

        Comments.create(req.body, (err, comment) => {
            if (err) {
                console.log('err: ' + err);
                next(err);
            }
            console.log('Comments added!');
            res.json(comment);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, (req, res, next) => {
        Comments.remove({songID: req.params.songID}, (err, resp) => {
            if (err) {
                console.log('err: ' + err);
                next(err);
            }
            res.json(resp);
        });
    });

router.route('/:songID/comments/:commentID')
    .get((req, res, next) => {
        Comments.findById(req.params.commentID, (err, comment) => {
            if (err) {
                console.log('err: ' + err);
                next(err);
            }
            res.json(comment);
        });
    })

    .put(Verify.verifyOrdinaryUser, (req, res, next) => {
        // protect userInfo from malicious modification
        if (req.decoded._id !== req.params.id) {
            var error = new Error('You are not authorized to perform this operation!');
            error.status = 403;
            return next(error);
        }

        Comments.findByIdAndUpdate(req.params.commentID, {
            $set: req.body
        }, {
            new: true
        }, (err, comment) => {
            if (err) {
                console.log('err: ' + err);
                next(err);
            }
            res.json(comment);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, (req, res, next) => {
        Comments.findByIdAndRemove(req.params.commentID, (err, resp) => {
            if (err) {
                console.log('err: ' + err);
                next(err);
            }
            res.json(resp);
        });
    });

module.exports = router;