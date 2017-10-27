/**
 * Created by Administrator on 2017/9/30.
 */

const mongoose = require('mongoose');
const schema = mongoose.Schema;

const songSchema = new schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    artistID: {
        type: String,
        default: ''
    },
    albumName: {
        type: String,
        default: ''
    },
    albumCover: {
        type: String,
        default: ''
    },
    url: {
        type: String,
        default: ''
    },
    time: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Songs = mongoose.model('Song', songSchema);

module.exports = Songs;