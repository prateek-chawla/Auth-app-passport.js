const passport = require("passport");
const { authenticate } = require("passport");

// Check if Authenticated
module.exports.isAuth = (req, res, next) => {
	if (req.isAuthenticated()) next();
	else {
		req.flash("error", "Sign In to get started");
		res.redirect("/users/sign-in");
	}
};

// If Already authenticated, dont authenticate again
module.exports.alreadyAuth = (req, res, next) => {
	if (!req.isAuthenticated()) next();
	else res.redirect("/");
};
