const User = require("../models/userModel");

module.exports.getUserProfile = async (req, res) => {
	const { id } = req.params;
	const user = await User.findById(id).populate("posts");
	res.render("users/userPage", { user });
};

module.exports.renderSignupForm = (req, res) => {
	res.render("logger/signUp");
};

module.exports.signupUser = async (req, res) => {
	try {
		const { username, password, email } = req.body;
		const user = new User({ username, email });
		const regUser = await User.register(user, password);
		req.login(regUser, (err) => {
			if (err) return next(err);
			req.flash("success", "Welcome!");
			res.redirect("/");
		});
	} catch (e) {
		req.flash("error", e.message);
		res.redirect("/user/signup");
	}
};

module.exports.renderLoginForm = (req, res) => {
	res.render("logger/login");
};

module.exports.loginUser = (req, res) => {
	console.log(req.session.returnTo);
	const redirectUrl = req.session.returnTo || "/";
	console.log("hii", redirectUrl);
	delete req.session.returnTo;
	res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
	req.logout();
	req.flash("success", "Logged out successfully!");
	res.redirect("/");
};
