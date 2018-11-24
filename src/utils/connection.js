const mongoose = require("mongoose"),
	dotenv = require("dotenv").load();

exports.handleConnection = () => {
	mongoose.connect(
		process.env.MONGO_DB_CONNECTION,
		{ useNewUrlParser: true }
	);

	mongoose.connection.on("connected", () => {
		console.log("App successfully connected to DB");
	});

	mongoose.connection.on("error", err => {
		console.log(
			`Error while connecting app to DB... aborting execution \nCaused by: ${err}`
		);
		process.exit(1);
	});

	mongoose.connection.on("disconnected", () => {
		console.log("App has been disconnected from DB");
		process.exit();
	});

	process.on("SIGINT", () => {
		mongoose.connection.close("Connection to DB closed due to app termination");
	});
};
