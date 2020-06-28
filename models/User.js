const mongoose = require("mongoose");

//User Schema
const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		resetToken: String,
		resetTokenExpiry: Date,
	},
	{ timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
