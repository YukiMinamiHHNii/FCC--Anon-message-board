const mongoose = require("mongoose"),
	Thread = require("../models/threadModel"),
	dotenv = require("dotenv").load();

function handleConnection(result) {
	mongoose.connect(
		process.env.MONGO_DB_CONNECTION,
		err => {
			return err ? result(err, false) : result(null, true);
		}
	);
}

exports.createThread = (data, result) => {
	handleConnection((error, connected) => {
		if (!connected) {
			return result({ status: "Error while connecting to DB", error: error });
		} else {
			new Thread({
				board: data.board,
				text: data.thread,
				delete_password: data.password
			}).save((error, savedThread) => {
				if (error) {
					return result({
						status: "Error while saving new thread",
						error: error
					});
				} else {
					return result(savedThread);
				}
			});
		}
	});
};
