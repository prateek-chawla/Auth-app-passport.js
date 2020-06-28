const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const mongoose = require("mongoose");

//Passport Auth - Local & Google
const passport = require("passport");
const passportLocal = require("./config/passport-local");
const passportGoogle = require("./config/passport-google");

const db = require("./config/mongoose");
const app = express();

const PORT = 8000;

// Set ejs as View Engine
app.set("view engine", "ejs");
app.use(expressLayouts);

//Body Parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

//Set static folder
app.use(express.static("assets"));

//Set up express session
app.use(
	session({
		secret: "session secret",
		resave: false,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());

//Connect-flash
app.use(flash());

// Import Routes
const userRoutes = require("./routes/users");
const indexRoutes = require("./routes/index");

// Setup Routes
app.use("/users", userRoutes);
app.use("/", indexRoutes);

app.listen(PORT, err => {
	if (err) console.log(err);
	else console.log(`Server started on Port ${PORT}`);
});
