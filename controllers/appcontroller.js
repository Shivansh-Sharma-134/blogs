const { title } = require("process");
const db = require("../data/queries");
const {validationResult} = require("express-validator");
const passport = require("passport");
const bcrypt = require('bcryptjs');

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
    const likes = await db.getAllLikes();
    console.log(blogs,users,likes);
    
    res.json({
        user:req.user || null,
        blogs,
        likes,
        users
    });
} catch(err){
    res.status(500).json({error: "Server Error"});
}
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
        
        return res.status(400).json({
            errors: errorMap,
        })
    }
    const {firstname,lastname,username,email,password,age} = req.body
    const hashedPassword = await bcrypt.hash(password,10);
    await db.addUser(firstname,lastname,username,email,hashedPassword,age);

    res.json({success: true});
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

async function membershipCheck(req,res) {
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

    await db.changeMembership(req.user.id);
    res.json({success: true})
}

async function deleteProfile(req,res,next) {
    const userid = req.user.id;
    try{
    req.logout((err) => {
    if (err) {
      return next(err);
    }});

    await db.deleteProfile(userid);
    res.json({success: true});
}catch(err){
    next(err);
}
}

module.exports={
    renderHomepage,
    addUser,
    logIn,
    membershipCheck,
    deleteProfile,
}