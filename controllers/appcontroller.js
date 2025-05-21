const { title } = require("process");
const db = require("../data/queries");
const {validationResult} = require("express-validator");
const passport = require("passport");

/*async function renderHomepage(req,res) {
    const blogs = await db.getAllBlogs();
    const users = await db.getAllUsers();
    console.log(req.user);
    
    res.render("home",{title:"homepage", blogs,
        user: req.user,
        users
    });
}*/

async function renderHomepage(req,res) {
   try{
     const blogs = await db.getAllBlogs();
    const users = await db.getAllUsers();
    console.log(req.user);
    
    res.json({
        user:req.user || null,
        blogs,
        users
    });
} catch(err){
    res.status(500).json({error: "Server Error"});
}
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
        
        return res.status(400).json({
            errors: errorMap,
        })
    }
    
    passport.authenticate("local",(err,user,info)=>{
        if(err || !user){
            return res.status(500).json({errors:{form:"invalid credentials"}});
        }
        req.login(user,err =>{
            if (err) return res.status(500).json({ errors: { form: "Login error" } });
            return res.json({ success: true });
        });

    })(req,res,next)
};


async function profile(req,res) {
    const blogs = await db.getBlogsByUser(req.user.id)
    
    res.render("profile",{title:"user profile",user: req.user,blogs})
}

async function applyMembership(req,res) {
    res.render("membershipForm",{
        title: "membership Form",
        old:{},
        errors:{}
    });
}

async function membershipCheck(req,res) {
        const errors = validationResult(req);

    if(!errors.isEmpty()){
        const errArray = errors.array();
        const errorMap = {}
        errArray.forEach(err => {
            errorMap[err.path] = err.msg;
        })
        console.log(errorMap);
        
        return res.status(400).render("membershipForm",{
            title: "membership Form",
            errors: errorMap,
            old: req.body
        })
    }

    await db.changeMembership(req.user.id);
    res.redirect("/users/profile")
}



async function applyAdmin(req,res) {
    res.render("adminForm",{
        title: "Admin Form",
        old:{},
        errors:{}
    });
}

async function adminCheck(req,res) {
        const errors = validationResult(req);

    if(!errors.isEmpty()){
        const errArray = errors.array();
        const errorMap = {}
        errArray.forEach(err => {
            errorMap[err.path] = err.msg;
        })
        console.log(errorMap);
        
        return res.status(400).render("adminForm",{
            title: "Admin Form",
            errors: errorMap,
            old: req.body
        })
    }

    await db.changeAdmin(req.user.id);
    res.redirect("/users/profile")
}

module.exports={
    renderHomepage,
    signupForm,
    addUser,
    logInForm,
    logIn,
    profile,
    applyMembership,
    membershipCheck,
    applyAdmin,
    adminCheck
}