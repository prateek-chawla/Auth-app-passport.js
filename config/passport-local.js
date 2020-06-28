const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/User");

passport.use(
	new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
		User.findOne({ email: email }, (err, user) => {
			if (err) {
				console.log("Error in finding User");
				return done(err);
			}
			if (!user) {
				return done(null, false, { message: "Incorrect Email or Password" });
			}
			// If user exists
			bcrypt.compare(password, user.password, (err, pwdMatch) => {
				if (err) throw err;
				if (pwdMatch) return done(null, user);
				else return done(null, false, { message: "Incorrect Password" });
			});
		});
	})
);

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

module.exports = passport;
