const { Router } = require("express");
const blogsRouter = Router();
const blogController = require("../controllers/blogcontroller");
const { body, validationResult } = require("express-validator");
const {authenticateJWT} = require('../utils/jwt')



blogsRouter.post("/addnewblog",authenticateJWT,blogController.addNewBlog);
blogsRouter.post("/delete",authenticateJWT,blogController.deleteBlog);
blogsRouter.post("/like",authenticateJWT,blogController.addLike );
blogsRouter.post("/dislike",authenticateJWT,blogController.removeLike );

module.exports = blogsRouter;