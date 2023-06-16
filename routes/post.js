const express = require("express")
const router = express.Router()
const Posts = require("../schemas/post.js")

// 전체 게시글 조회
router.get("/posts", async (req, res) => {
    const allPosts = await Posts.find()
    allPosts.sort(
        function (prev, next) {
            if (prev.date > next.date) { return -1 }
            else if (prev.date == next.date) { return 0 }
            else if (prev.date < next.date) { return 1 }
        }
    )
    if (!allPosts.length) {
        return res.status(404).json({
            errorMessage: "작성된 게시글이 없습니다."
        })
    } else {
        return res.status(200).json({ "posts": allPosts })
    }
})

// postId 값을 가진 게시글 조회
router.get("/posts/:postId", async (req, res) => {
    const postId = req.params.postId
    console.log(postId)
    const post = await Posts.find({ "postId": postId })
    if (!post.length) {
        return res.status(404).json({
            errorMessage: "해당 게시글을 찾을 수 없습니다.."
        })
    }
    else {
        return res.status(200).json(post)
    }
})

// 작성할려는 게시글 postId 중복 여부 확인 > 작성 
router.post("/posts", async (req, res) => {
    const { postId, title, postname, datail, date, postpw } = req.body
    const postsid = await Posts.find({ postId })
    if (postsid.length) {
        return res.status(400).json({
            success: false,
            errorMessage: "이미 사용된 postId 입니다."
        })
    }
    const creatdPost = await Posts.create({ postId, title, postname, datail, date, postpw })
    res.status(201).json(creatdPost);
})

// postId 값을 가진 게시글 찾기 > 입력한 pw 일치 여부 확인 > 수정
router.put("/posts/:postId", async (req, res) => {
    const { postid } = req.params
    const { title, datail, postpw } = req.body

    const post = await Posts.findOne({ postid }).select("+postpw")

    if (!post) {
        return res.status(404).json({
            success: false,
            errorMessage: "해당 게시글을 찾을 수 없습니다."
        })
    }
    else if (post.postpw !== postpw) {
        return res.status(404).json({
            success: false,
            errorMessage: "비밀번호가 일치하지 않습니다."
        })
    }
    await Posts.updateOne(
        { postId: postid },
        {
            $set: {
                title: title,
                datail: datail,
                date: new Date,
            }
        }
    )
    return res.status(200).json({
        success: true,
        message: "해당 게시글이 수정되었습니다."
    })
})

// 삭제할려는 게시글 일치 여부 확인 > postId 값을 가진 게시글 찾기 > 비밀번호 일치 여부 확인 > 삭제
router.delete("/posts/:postId", async (req, res) => {
    const postid = req.params.postId
    const { postId, postpw } = req.body
    const post = await Posts.findOne({ postId }).select("+postpw")

    if (postid != postId) {
        return res.status(404).json({
            success: false,
            errorMessage: "삭제할려는 게시글의 id값을 확인해주세요."
        })
    }
    else if (!post) {
        return res.status(404).json({
            success: false,
            errorMessage: "해당 게시글을 찾을 수 없습니다."
        })
    }
    else if (post.postpw !== postpw) {
        return res.status(404).json({
            success: false,
            errorMessage: "비밀번호가 일치하지 않습니다."
        })
    }
    else {
        await Posts.deleteOne({ postId })
        return res.status(200).json({
            success: true,
            message: "해당 댓글이 삭제되었습니다."
        })
    }
})

module.exports = router