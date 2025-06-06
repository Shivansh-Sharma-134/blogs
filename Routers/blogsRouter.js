const { Router } = require("express");
const blogsRouter = Router();
const blogController = require("../controllers/blogcontroller");
const { body, validationResult } = require("express-validator");




blogsRouter.post("/addnewblog",blogController.addNewBlog);
blogsRouter.post("/delete",blogController.deleteBlog);
blogsRouter.post("/like",blogController.addLike );
blogsRouter.post("/dislike",blogController.removeLike );

module.exports = blogsRouter;