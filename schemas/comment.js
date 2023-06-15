const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
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
        type : Number,
        required: true,
        unique: true,
        select: false
    }
},{
    versionKey: false,
})

module.exports = mongoose.model("Comments", commentSchema);