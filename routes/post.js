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

// 해당 title을 가진 게시글 조회
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

// 게시글 작성 ( 중복 비밀번호 사용 불가능 )
router.post("/posts", async (req, res) => {
    const { postId, title, name, datail, date, pw } = req.body
    const postspw = await Posts.find({pw})
    const postsid = await Posts.find({postId})
    if (postspw.length) {
        return res.status(400).json({
            success: false,
            errorMessage: "이미 사용된 비밀번호 입니다."
        })
    }
    else if (postsid.length) {
        return res.status(400).json({
            success: false,
            errorMessage: "이미 사용된 postId 입니다."
        })
    }
    const creatdPost = await Posts.create({ postId, title, name, datail, date, pw })
    res.status(201).json(creatdPost);
})

// 해당 비밀번호를 가진 게시글 수정하기 ( 수정해야함. )
router.put("/posts/:pw", async (req, res) => {
    const { pw } = req.params
    const { title, name, datail} = req.body

    const post = await Posts.find({ pw })
    if (post.length) {
        await Posts.updateOne(
            { pw: pw },
            { $set: { 
                title: title,
                name: name,
                datail: datail,
                date: new Date,
            }}
        )
        res.status(200).json({ success: true })
    }
    else if (!post.length) {
        res.status(404).json({
            errorMessage:"비밀번호가 틀렸습니다."
        })
    }
})

// 해당 비밀번호를 가진 게시글 삭제 ( 수정해야함. )
router.delete("/posts/:pw", async (req, res) => {
    const { pw } = req.params

    const post = await Posts.find({ pw })
    if (!post.length) {
        res.status(404).json({
            errorMessage: "비밀번호가 틀렸습니다."
        })
        return
    }
    else {
        await Posts.deleteOne({pw})
    }
        res.json("게시글이 삭제되었습니다.")
})

module.exports = router