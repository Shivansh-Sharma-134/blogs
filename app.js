const express = require("express");
const userRouter = require("./Routers/userRouter");
require("dotenv").config();
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser')
const {authenticateJWT} = require('./utils/jwt')
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
}));

app.use(express.json());

app.use(express.urlencoded({extended: true}));
const appController = require("./controllers/appcontroller");
const blogsRouter = require("./Routers/blogsRouter");
app.use(cookieParser());


app.get("/api/homepage",authenticateJWT,appController.renderHomepage);
app.use("/api/users",userRouter);
app.use("/api/blogs",blogsRouter)

const PORT = 3000;
app.listen(PORT, ()=> console.log("listening"));