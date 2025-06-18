const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateToken(user){
    return jwt.sign(
        {id: user.id,username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: '1d'}
    )
}

function authenticateJWT(req,res,next){
    const token = req.cookies?.token || req.header.authorization?.split(' ')[1];
    if(!token) return res.status('401').json({message: 'no token provided'});
    try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
}

module.exports = {
    generateToken,
    authenticateJWT,
}