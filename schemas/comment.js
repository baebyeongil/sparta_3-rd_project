const mongoose = require("mongoose");
const Posts = require("../schemas/post.js")

const commentSchema = new mongoose.Schema({
    postId: {
        type: Number,
        requird: true,
    },
    commentId: {
        type: Number,
        required: true,
        unique: true,
        select: false
    },
    username: {
        type: String,
        requird: true,
    },
    usercommet: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    commentpw: {
        type: Number,
        required: true,
        select: false
    }
}, {
    versionKey: false,
})

const comnnets = mongoose.model("Comments", commentSchema);

module.exports = comnnets