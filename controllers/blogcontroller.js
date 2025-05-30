const { title } = require("process");
const db = require("../data/queries");
const {validationResult} = require("express-validator");
const passport = require("passport");

async function addNewBlogForm(req,res) {
    res.render("newBlogForm")
}

async function addNewBlog(req,res) {
    const {title,blogText,}=req.body;
    await db.addNewBlog(title,blogText,req.user.id);
    res.json({success: true});
}

async function deleteBlog(req,res) {
    const {blogId} = req.body;
    await db.deleteBlog(blogId);
    res.json({success: true});
}

async function addLike(req,res) {
    try{
        const {userid,blogid} = req.body;
        db.addLike(userid,blogid);
        res.json({success: true});
    } catch(error) {
        res.status(500).json({error: "Server Error"});
    }
}

async function removeLike(req,res) {
    try{
        const {userid,blogid} = req.body;
        db.removeLike(userid,blogid);
        res.json({success: true});
    } catch(error) {
        res.status(500).json({error: "Server Error"});
    }
}

module.exports = {
    addNewBlogForm,
    addNewBlog,
    deleteBlog,
    addLike,
    removeLike
}