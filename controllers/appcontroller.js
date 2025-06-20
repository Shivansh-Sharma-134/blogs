const { title } = require("process");
const db = require("../data/queries");
const {validationResult} = require("express-validator");
const passport = require("passport");
const bcrypt = require('bcryptjs');
const {generateToken} = require('../utils/jwt')
async function renderHomepage(req,res) {
   try{
     const blogs = await db.getAllBlogs();
    const users = await db.getAllUsers();
    const likes = await db.getAllLikes();
    
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

async function logIn(req,res) {
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
    
     const { username, password } = req.body;
     const user = await db.getUserByUsername(username);
     if(!user) return res.status(401).json({message: "user not found"});
     const match = await bcrypt.compare(password,user.password);    
     if(!match) return res.status(401).json({message: "invalid credentials"});

    const token = generateToken(user);

    res.cookie("token",token,{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    }).json({success : true})

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