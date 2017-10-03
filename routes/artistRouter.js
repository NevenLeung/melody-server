/**
 * Created by Administrator on 2017/10/2.
 */

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Artists = require('../models/artists');

const router = express.Router();
router.use(bodyParser.json());

router.route('/')
    .get((req, res, next) => {
        Artists.find(req.query, (err, artists) => {
            if (err) {
                console.log('err: ' + err);
                next(err);
            }
            res.json(artists);
        });
    })

    .post((req, res, next) => {
        Artists.create(req.body, (err, artist) => {
            if (err) {
                console.log('err: ' + err);
                next(err);
            }
            console.log('Artist created!');
            res.json(artist);
        });
    })

    .delete((req, res, next) => {
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

    .put((req, res, next) => {
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

    .delete((req, res, next) => {
        Artists.findByIdAndRemove(req.params.id, (err, resp) => {
            if (err) {
                console.log('err: ' + err);
                next(err);
            }
            res.json(resp);
        });
});

module.exports = router;

