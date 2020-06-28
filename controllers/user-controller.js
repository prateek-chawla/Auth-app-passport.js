const bcrypt = require("bcryptjs");
const User = require("../models/User");
const passport = require("passport");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");

//Set up Transporter for nodemail
const transporter = nodemailer.createTransport(
	sendgrid({
		auth: {
			api_key:
				"<Your_sendgrid_key>",
		},
	})
);

//Logout and redirect to sign in
module.exports.logout = (req, res) => {
	req.logout();
	req.flash("successMsg", "Logged Out Sucessfully");
	res.redirect("/users/sign-in");
};

//Sign in Controllers
module.exports.getSignIn = (req, res) => {
	res.render("sign-in", {
		successMsg: req.flash("successMsg"),
		errorMsg: req.flash("error"),
	});
};

module.exports.postSignIn = (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/users/sign-in",
		failureFlash: true,
	})(req, res, next);
};


//Sign up Controllers
module.exports.getSignUp = (req, res) => {
	res.render("sign-up", {
		successMsg: req.flash("successMsg"),
		errorMsg: req.flash("error")[0],
	});
};


module.exports.postSignUp = async (req, res) => {
	const errors = [];
	const { name, email, password, confirmPassword } = req.body;
	validatePassword(password, confirmPassword, errors);

	if (errors.length > 0)
		return res.render("sign-up", { name, email, password, confirmPassword, errors });

	try {
		let user = await User.findOne({ email: email });
		if (user) {
			errors.push("User with this E-mail already exists, try another one");
			res.render("sign-up", { name, email, password, confirmPassword, errors });
		} else {
			const salt = await bcrypt.genSalt(10);
			const hashedPwd = await bcrypt.hash(password, salt);
			let newUser = new User({ name, email, password: hashedPwd });
			await newUser.save();
			req.flash("successMsg", "Sign Up Successful");
			res.redirect("/users/sign-in");
		}
	} catch (err) {
		console.log(err);
	}
};

// Forgot/Reset Password
module.exports.getResetPwd = (req, res) => {
	res.render("reset-password", {
		successMsg: req.flash("successMsg"),
		errorMsg: req.flash("error"),
	});
};

module.exports.postResetPwd = async (req, res) => {
	const email = req.body.email;
	try {
		const buffer = await crypto.randomBytes(32);
		const token = buffer.toString("hex");
		let user = await User.findOne({ email: email });
		if (!user) {
			req.flash("error", "Invalid Email");
			return res.redirect("/users/reset-password");
		}
		user.resetToken = token;
		user.resetTokenExpiry = Date.now() + 60 * 60 * 1000;
		await user.save();
		req.flash("successMsg", "Email Sent");
		res.redirect("/users/sign-in");
		sendResetEmail(email, token);
	} catch (err) {
		console.log(err);
		res.redirect("/users/reset-password");
	}
};

// Reset Password from token
module.exports.getForgotPwd = async (req, res) => {
	const token = req.params.token;
	let user = await User.findOne({
		resetToken: token,
		resetTokenExpiry: { $gt: Date.now() },
	});
	if (!user) {
		req.flash("error", "Invalid Token");
		res.redirect("/users/sign-in");
	}
	res.render("forgot-password", {
		successMsg: req.flash("successMsg"),
		errorMsg: req.flash("error"),
	});
};

module.exports.postForgotPwd = async (req, res) => {
	const token = req.params.token;
	let user = await User.findOne({
		resetToken: token,
		resetTokenExpiry: { $gt: Date.now() },
	});
	if (!user) {
		req.flash("error", "Invalid Token");
		res.redirect("/users/sign-in");
	}

	const { password, confirmPassword } = req.body;
	const errors = [];
	validatePassword(password, confirmPassword, errors);
	if (errors.length > 0) {
		req.flash("error", errors[0]);
		return res.redirect("back");
	}
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPwd = await bcrypt.hash(password, salt);
		user.password = hashedPwd;
		user.resetToken = null;
		user.resetTokenExpiry = null;
		await user.save();
		req.flash("successMsg", "Password Updated Successfully");
		res.redirect("/users/sign-in");
	} catch (err) {
		console.log(err);
	}
};

// Update password for logged in user
module.exports.getUpdatePwd = (req, res) => {
	res.render("update-password", {
		successMsg: req.flash("successMsg"),
		errorMsg: req.flash("error"),
	});
};

module.exports.postUpdatePwd = async (req, res) => {
	try {
		let user = await User.findOne({ email: req.user.email });

		if (!user) return res.redirect("/users/sign-in");
		let pwdMatch = await bcrypt.compare(req.body.oldPassword, user.password);

		if (!pwdMatch) {
			req.flash("error", "Incorrect Password");
			return res.redirect("back");
		}
		const errors = [];
		const { password, confirmPassword } = req.body;
		validatePassword(password, confirmPassword, errors);
		if (errors.length > 0)
			return res.render("update-password", {
				password,
				confirmPassword,
				errors,
			});
		const salt = await bcrypt.genSalt(10);
		const hashedPwd = await bcrypt.hash(password, salt);
		user.password = hashedPwd;
		await user.save();
		req.flash("successMsg", "Password Update Successful");
		res.render("update-password", {
			successMsg: req.flash("successMsg"),
		});
	} catch (err) {
		console.log(err);
		res.redirect("back");
	}
};


// Check Validity of Passwords
validatePassword = (password, confirmPassword, errors) => {
	if (password !== confirmPassword) errors.push("Passwords do not match");
	if (password.length <= 7) errors.push("Password should be atleast 8 characters");
	//Should contain special character
	const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
	if (!specialChars.test(password))
		errors.push("Password should contain a special character");
};

//Send Mail for password reset
sendResetEmail = (email, token) => {
	transporter.sendMail({
		to: email,
		from: "auth.app.pc@gmail.com",
		subject: "Password Reset auth-app",
		html: `
		<p><strong> Password Reset Link </strong></p>
		<a href='http://localhost:8000/users/reset/${token}'><p>Click Here</p></a>
		<p> This Link expires in one hour. </p>
		`,
	});
};
