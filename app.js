const express = require("express");
const path = require("node:path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const userRouter = require("./Routers/userRouter");
const db = require("./data/queries");
require("dotenv").config();
const app = express();
const cors = require("cors")

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
}));

app.use(express.json());

app.use(express.urlencoded({extended: true}));
const appController = require("./controllers/appcontroller");
const blogsRouter = require("./Routers/blogsRouter");

app.set('views',path.join(__dirname,"views"));
app.set("view engine","ejs");

app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: false }));
app.use(passport.session());

passport.use(
    new LocalStrategy(async (username,password,done)=>{
        const user  = await db.getUser(username);
        if(!user){
            return done(null, false,{message:"Incorrect username"});
        }
        if(user.password !== password){
            return done(null,false,{message:"Incorrect password"})
        }
        return done(null,user);
    })
)

passport.serializeUser((user,done)=>{
    done(null, user.id);
})

passport.deserializeUser(async (id,done)=>{
    const user = await db.getUserById(id);
    done(null,user);
})
app.get("/api/homepage",appController.renderHomepage);
app.use("/api/users",userRouter);
app.use("/api/blogs",blogsRouter)

const PORT = 3000;
app.listen(PORT, ()=> console.log("listening"));