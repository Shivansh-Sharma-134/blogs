const express = require("express");
const path = require("node:path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const userRouter = require("./Routers/userRouter")

const app = express();

app.use(express.urlencoded({extended: true}));
const appController = require("./controllers/appcontroller")

app.set('views',path.join(__dirname,"views"));
app.set("view engine","ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());

app.get("/",appController.renderHomepage);
app.use("/users",userRouter);

const PORT = 3000;
app.listen(PORT, ()=> console.log("listening"));