/**
 * Created by Administrator on 2017/10/2.
 */

const mongoose = require('mongoose');
const schema = mongoose.Schema;

const artistSchema = new schema({
    artistName: {
        type: String,
        required: true,
        unique: true
    },
    artistPhoto: {
        type: String,
        default: ''
    },
    introduction: {
        type: String,
        default: ''
    },
    recommended: {
        type: String,
        default: ''
    }
},{
    timestamps: true
});

const Artists = mongoose.model('Artist', artistSchema);

module.exports = Artists;