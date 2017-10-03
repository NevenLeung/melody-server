/**
 * Created by Administrator on 2017/10/3.
 */

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Songs = require('../models/songs');
const Artist = require('../models/artists');

const router = express.Router();
router.use(bodyParser.json());

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

    .post((req, res, next) => {
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

    .delete((req, res, next) => {
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

    .put((req, res, next) => {
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

    .delete((req, res, next) => {
        Songs.findByIdAndRemove(req.params.id, (err, resp) => {
            if (err) {
                console.log('err: ' + err);
                next(err);
            }
            res.json(resp);
        });
    });

module.exports = router;