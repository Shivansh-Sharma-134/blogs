const { title } = require("process");
const db = require("../data/queries");
const {validationResult} = require("express-validator");

async function renderHomepage(req,res) {
    const blogs = await db.getAllBlogs();
    console.log(blogs);
    
    res.render("home",{title:"homepage", blogs});
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
    res.render("log-in-form")
}

async function logIn(req,res) {
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

module.exports={
    renderHomepage,
    signupForm,
    addUser,
    logInForm,
    logIn
}