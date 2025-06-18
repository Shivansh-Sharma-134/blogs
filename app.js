const express = require("express");
const path = require("node:path");
const userRouter = require("./Routers/userRouter");
const db = require("./data/queries");
const pool = require("./data/pool");
require("dotenv").config();
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser')

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
}));

app.use(express.json());

app.use(express.urlencoded({extended: true}));
const appController = require("./controllers/appcontroller");
const blogsRouter = require("./Routers/blogsRouter");
app.use(cookieParser());
//app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: false }));

/*app.use(session({ store: new pgSession({
    pool: pool,
    tableName: 'session'
}), secret: process.env.SECRET, resave: false, saveUninitialized: false, cookie: {
    maxAge: 1000 * 60 * 60 * 24} }));
app.use(passport.session());*/


app.get("/api/homepage",appController.renderHomepage);
app.use("/api/users",userRouter);
app.use("/api/blogs",blogsRouter)

const PORT = 3000;
app.listen(PORT, ()=> console.log("listening"));