/**
 * Created by Administrator on 2017/10/26.
 */

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const schema = mongoose.Schema;

const commentSchema = new schema(
    {
        songID: {
            type: String,
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
);

commentSchema.plugin(mongoosePaginate);

const Comments = mongoose.model('Comment', commentSchema);

module.exports = Comments;