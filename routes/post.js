const express = require("express")
const router = express.Router()
const Posts = require("../schemas/post.js")
const { title } = require("process")
const { truncate } = require("fs")

// 전체 게시글 조회
router.get("/posts", async (req, res) => {
    const allPosts = await posts.find()
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
router.get("/posts/:title", async (req, res) => {
    const title = req.params.title
    const post = await Posts.find({ "title": title })
    if (!post.length) {
        return res.status(404).json({
            errorMessage: "해당 제목의 게시글을 찾을 수 없습니다.."
        })
    }
    else {
        return res.status(200).json(post)
    }
})

// 게시글 작성 ( 중복 비밀번호 사용 불가능 )
router.post("/post", async (req, res) => {
    const { title, name, datail, date, pw } = req.body
    const posts = await Posts.find({ pw })
    if (posts.length) {
        return res.status(400).json({
            success: false,
            errorMessage: "이미 사용된 비밀번호 입니다."
        })
    }
    const creatdPost = await Posts.create({ title, name, datail, date, pw })
    res.status(201).json({ creatdPost });
})

// 해당 비밀번호를 가진 게시글 수정하기
router.put("/posts/:pw", async (req, res) => {
    const { pw } = req.params
    const { title, name, datail, date } = req.body

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

// 해당 비밀번호를 가진 게시글 삭제
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