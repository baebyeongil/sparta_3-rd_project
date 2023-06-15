const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
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
        type : Number,
        required: true,
        unique: true,
        select: false
    }
},{
    versionKey: false,
})

module.exports = mongoose.model("Posts", postSchema);