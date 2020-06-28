const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");

const User = require("../models/User");

passport.use(
	new GoogleStrategy(
		{
			clientID:
				"<Your_Client_ID>",
			clientSecret: "<Your_Client_Secret>",
			callbackURL: "http://localhost:8000/users/auth/google/callback",
		},
		function (accessToken, refreshToken, profile, done) {
			User.findOne({ email: profile.emails[0].value }, (err, user) => {
				if (err) {
					console.log("Error - Google Auth");
					return;
				}
				if (user) return done(null, user);
				User.create(
					{
						name: profile.displayName,
						email: profile.emails[0].value,
						//Generate random password
						password: crypto.randomBytes(20).toString("hex"),
					},
					(err, newUser) => {
						if (err) {
							console.log("Error in Creating User");
							return;
						}
						return done(null, newUser);
					}
				);
			});
		}
	)
);
module.exports = passport;
