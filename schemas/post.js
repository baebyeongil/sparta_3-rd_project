const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    postId: {
        type: Number,
        required: true,
        unique: true,
        select: false
    },
    title: {
        type: String,
        requird: true,
    },
    name: {
        type: String,
        requird: true,
    },
    datail: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    pw: {
        type: Number,
        required: true,
        unique: true,
        select: false
    }
}, {
    versionKey: false,
})

// postSchema.virtual('postId').get(function () {
//     return this._id.toHexString();  // 이 부분의 this._id에 해당하는 부분을 가상화 시킨다.
// });
// postSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model("Posts", postSchema);