const express = require('express');
const router = express.Router();
const Comments = require("../schemas/comment.js")
const Posts = require("../schemas/post.js");

// 입력하고자하는 postIdnum과 postId값 일치 확인 > postId 값을 가진 게시글 확인 > ( postIdnum과 postId값 일치 확인을 해주는 이유는 해당 게시글에 댓글을 달기 위해서 )
// usercommet 입력 여부 확인 > commentId 중복 여부 확인 > commentpw 중복 여부 확인 > 입력
router.post("/comment/:postId", async (req, res) => {
    const postids = req.params.postId
    const post = await Posts.find({ "postId": postids })

    const { postIdnum, commentId, username, usercommet, date, commentpw } = req.body

    const comment = await Comments.find({ "commentpw": commentpw })
    const Id = await Comments.find({ "commentId": commentId })
    // const postIdnums = await Comments.find({ "postIdnum": postIdnum })

    if (postIdnum != postids) {
        return res.status(404).json({
            success: false,
            errorMessage: "입력하고자 하는 게시글Id 값을 확인해주세요."
        })
    }
    else if (!post.length) {
        return res.status(404).json({
            success: false,
            errorMessage: "해당 게시글을 찾을 수 없습니다."
        })
    }
    else if (!usercommet) {
        return res.status(400).json({
            success: false,
            errorMessage: "댓글 입력해주세요."
        })
    }
    else if (Id.length) {
        return res.status(400).json({
            success: false,
            errorMessage: "다른 Id값을 입력해주세요."
        })
    }
    else if (comment.length) {
        return res.status(400).json({
            success: false,
            errorMessage: "다른 비밀번호를 입력해주세요."
        })
    }
    const creatdComment = await Comments.create({ postIdnum, commentId, username, usercommet, date, commentpw })
    return res.status(201).json(creatdComment)
})

// commentId 일치하는 댓글 여부 확인 > 출력 
router.get("/comment/:commentId", async (req, res) => {
    const commentId = req.params.postIdnum
    const coment = await Comments.find({ "commentId": commentId })
    coment.sort(
        function (prev, next) {
            if (prev.date > next.date) { return -1 }
            else if (prev.date == next.date) { return 0 }
            else if (prev.date < next.date) { return 1 }
        }
    )
    if (!coment.length) {
        return res.status(404).json({
            errorMessage: "해당 댓글을 찾을 수 없습니다.."
        })
    }
    else {
        return res.status(200).json(coment)
    }
})

// commentId 일치하는 댓글 여부 확인 > 입력한 commentpw 와 일치하는지 확인 > 수정
router.put("/comment/:commentId", async (req, res) => {
    const commentid = req.params.commentId
    const comment = await Comments.find({ "commentId": commentid })

    const { usercommet, commentpw } = req.body
    const comments = await Comments.find({ "commentpw": commentpw })

    if (!comment.length) {
        return res.status(404).json({
            success: false,
            errorMessage: "해당 댓글을 찾을 수 없습니다."
        })
    }
    else if (!usercommet) {
        return res.status(400).json({
            success: false,
            errorMessage: "댓글 입력해주세요."
        })
    }
    else if (!comments.length) {
        return res.status(400).json({
            success: false,
            errorMessage: "비밀번호가 틀렸습니다."
        })
    }
    await Comments.updateOne(
        { commentpw: commentpw },
        {
            $set: {
                usercommet: usercommet,
                date: new Date,
            }
        }
    )
    return res.status(200).json({
        success: true,
        message: "해당 댓글이 수정되었습니다."
    })
})

// commentid 일치하는 댓글 여부 확인 > commentpw 일치하는 여부 확인 > 삭제
router.delete("/comment/:commentId", async (req, res) => {
    const commentid = req.params.commentId
    const comment = await Comments.find({ "commentId": commentid })

    const { commentpw } = req.body
    const comments = await Comments.find({ "commentpw": commentpw })

    if (!comment.length) {
        return res.status(404).json({
            success: false,
            errorMessage: "해당 댓글을 찾을 수 없습니다."
        })
    }
    else if (!comments.length) {
        return res.status(400).json({
            success: false,
            errorMessage: "비밀번호가 틀렸습니다."
        })
    }
    else {
        await Comments.deleteOne({ commentpw })
        return res.status(200).json({
            success: true,
            message: "해당 댓글이 삭제되었습니다."
        })
    }
})

module.exports = router