/**
 * Created by Administrator on 2017/10/10.
 */
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const FavoriteList = new schema({
    songInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }
});

const User = new schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    avatar: {
        type: String,
        default: ''
    },
    introduction: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false
    },
    favorites: [FavoriteList]
},{
    timestamps: true
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);

