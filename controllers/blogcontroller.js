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
    res.redirect("/");
}

async function deleteBlog(req,res) {
    await db.deleteBlog(req.params.blogId);
    res.redirect("/")
}

module.exports = {
    addNewBlogForm,
    addNewBlog,
    deleteBlog
}