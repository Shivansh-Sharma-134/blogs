const { title } = require("process");
const db = require("../data/queries");
const {validationResult} = require("express-validator");
const passport = require("passport");

async function renderHomepage(req,res) {
    const blogs = await db.getAllBlogs();
    const users = await db.getAllUsers();
    console.log(req.user);
    
    res.render("home",{title:"homepage", blogs,
        user: req.user,
        users
    });
}

async function signupForm(req,res) {
    res.render("sign-up-form",{title: "sign up form",
        old:{},
        errors:{}
    });
}

async function addUser(req,res) {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const errArray = errors.array();
        const errorMap = {}
        errArray.forEach(err => {
            errorMap[err.path] = err.msg;
        })
        console.log(errorMap);
        
        return res.status(400).render("sign-up-form",{
            title: "sign up form",
            errors: errorMap,
            old: req.body
        })
    }
    const {firstname,lastname,username,email,password,age} = req.body

    await db.addUser(firstname,lastname,username,email,password,age);

    res.redirect("/");
}

async function logInForm(req,res) {
    res.render("log-in-form",{title: "Log in form",
        old:{},
        errors:{}
    })
}

async function logIn(req,res,next) {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const errArray = errors.array();
        const errorMap = {}
        errArray.forEach(err => {
            errorMap[err.path] = err.msg;
        })
        console.log(errorMap);
        
        return res.status(400).render("log-in-form",{
            title: "Log in form",
            errors: errorMap,
            old: req.body
        })
    }
    
    passport.authenticate("local",{
        successRedirect: "/",
        failureRedirect: "/users/login"
    })(req,res,next)
};

module.exports={
    renderHomepage,
    signupForm,
    addUser,
    logInForm,
    logIn
}