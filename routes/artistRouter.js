/**
 * Created by Administrator on 2017/10/2.
 */

const express = require('express');

const Artists = require('../models/artists');
const Verify = require('./verify');

const router = express.Router();

router.route('/')
    .get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, (req, res, next) => {
        Artists.find(req.query, (err, artists) => {
            if (err) {
                console.log('err: ' + err);
                next(err);
            }
            res.json({
                total: artists.length,
                data: artists
            });
        });
    })

    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, (req, res, next) => {
        Artists.create(req.body, (err, artist) => {
            if (err) {
                console.log('err: ' + err);
                next(err);
            }
            console.log('Artist created!');
            res.json(artist);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, (req, res, next) => {
        Artists.remove({}, (err, resp) => {
            if (err) {
                console.log('err: ' + err);
                next(err);
            }
            res.json(resp);
        });
    });

router.route('/:id')
    .get((req, res, next) => {
        Artists.findById(req.params.id, (err, artist) => {
            if (err) {
                console.log('err: ' + err);
                next(err);
            }
            res.json(artist);
        });
    })

    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, (req, res, next) => {
        Artists.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
            new: true
        }, (err, artist) => {
            if (err) {
                console.log('err: ' + err);
                next(err);
            }
            res.json(artist);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, (req, res, next) => {
        Artists.findByIdAndRemove(req.params.id, (err, resp) => {
            if (err) {
                console.log('err: ' + err);
                next(err);
            }
            res.json(resp);
        });
});

module.exports = router;

