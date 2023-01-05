const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");
const passport = require("passport");
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });
const { isLoggedin } = require("../middlewares");

const catchAsync = (func) => {
	return function (req, res, next) {
		func(req, res, next).catch(next);
	};
};

router.get("/signup", userController.renderSignupForm);

router.post("/signup", userController.signupUser);

router.get("/login", userController.renderLoginForm);

router.post(
	"/login",
	passport.authenticate("local", {
		failureRedirect: "/user/login",
		failureFlash: true,
	}),
	userController.loginUser
);

router.get("/logout", userController.logoutUser);

router.get("/userinfo", catchAsync(userController.getUserInfo));

router.get("/:id", isLoggedin, catchAsync(userController.getUserProfile));

module.exports = router;
