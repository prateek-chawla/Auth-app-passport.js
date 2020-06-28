// Set up DB
const mongoose = require("mongoose");

//MongoDB Connection String
const connectionString =
	"<Your_MONGODB-Token>";

// Connect to MongoDB
mongoose.connect(connectionString, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error connecting to Database"));

db.once("open", () => {
	console.log("Connected To Database");
});
