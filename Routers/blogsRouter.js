const { Router } = require("express");
const blogsRouter = Router();
const blogController = require("../controllers/blogcontroller");
const { body, validationResult } = require("express-validator");



blogsRouter.get("/addnewblog",blogController.addNewBlogForm);
blogsRouter.post("/addnewblog",blogController.addNewBlog);
blogsRouter.post("/delete",blogController.deleteBlog)


module.exports = blogsRouter;