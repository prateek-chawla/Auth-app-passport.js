const express = require("express");
const router = express.Router();
const passport = require("passport");

const userController = require("../controllers/user-controller");
const homeController = require("../controllers/home-controller");
const isAuth = require("../config/passport-auth").isAuth;
const alreadyAuth = require("../config/passport-auth").alreadyAuth;

//Sign in Routes
router.get("/sign-in", alreadyAuth, userController.getSignIn);
router.post("/sign-in", userController.postSignIn);

//Sign up Routes
router.get("/sign-up", alreadyAuth, userController.getSignUp);
router.post("/sign-up", userController.postSignUp);

router.get("/logout", userController.logout);

//Reset password routes - Password Forgot
router.get("/reset-password", userController.getResetPwd);
router.post("/reset-password", userController.postResetPwd);
router.get("/reset/:token", userController.getForgotPwd);
router.post("/reset/:token", userController.postForgotPwd);

// Update Password for logged in user
router.get("/update-password", isAuth, userController.getUpdatePwd);
router.post("/update-password", isAuth, userController.postUpdatePwd);



//Google Authentication
router.get(
	"/auth/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);
//Google Authentication Callback
router.get(
	"/auth/google/callback",
	passport.authenticate("google", { failureRedirect: "/users/sign-in" }),
	homeController.getHome
);

module.exports = router;
