const { Router } = require("express");
const userRouter = Router();
const appController = require("../controllers/appcontroller");
const { body, validationResult } = require("express-validator");

const validateInfo = [
    body("firstname").trim().isAlpha().withMessage('must be letters').isLength({min: 1,max: 50}).withMessage('must be within 1 to 50 characters'),
    body("lastname").optional({ checkFalsy: true }).trim().isAlpha().withMessage('must be letters').isLength({min: 0,max: 50}).withMessage('must be within 1 to 50 characters'),
    body("username").trim().isLength({min: 1,max: 500}).withMessage('must be within 1 to 50 characters'),
    body("email").trim().isLength({min: 1,max: 200}).withMessage('must be within 1 to 200 characters').isEmail().withMessage('must be an email'),
    body("password").trim().isStrongPassword().withMessage('Password must be at least 8 characters long and include 1 lowercase, 1 uppercase, 1 number, and 1 symbol'),
    body("age").trim().isInt().withMessage('must be a number'),
]

const validateLogIn = [
    body("username").trim().isLength({min: 1}).withMessage('Cannot be empty'),
    body("password").trim().isLength({min: 1}).withMessage('Cannot be empty'),
]

const validateMembership =[
    body("membershipCode").equals(process.env.MEMBER).withMessage("Wrong Passcode")
]

const validateAdmin =[
    body("adminCode").equals(process.env.ADMIN).withMessage("Wrong Passcode")
]
userRouter.get("/signup",appController.signupForm);
userRouter.post("/signup",validateInfo,appController.addUser);

userRouter.get("/login",appController.logInForm)
userRouter.post("/login",validateLogIn,appController.logIn)
userRouter.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});


userRouter.get("/profile", appController.profile);

userRouter.get("/membershipapply", appController.applyMembership);
userRouter.post("/membershipapply",validateMembership,appController.membershipCheck )

userRouter.get("/adminapply", appController.applyAdmin);
userRouter.post("/adminapply",validateAdmin,appController.adminCheck )


module.exports= userRouter;