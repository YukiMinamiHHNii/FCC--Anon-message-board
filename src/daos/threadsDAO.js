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

exports.getThreads = (data, result) => {
	handleConnection((error, connected) => {
		if (!connected) {
			return result({ status: "Error while connecting to DB", error: error });
		} else {
			Thread.find({ board: data.board })
				.sort({ created_on: -1 })
				.limit(10)
				.select({ __v: 0, delete_password: 0, reported: 0 })
				.populate({
					path: "replies",
					select: { __v: 0, delete_password: 0, reported: 0 },
					options: { limit: 3, sort: { created_on: -1 } }
				})
				.exec((err, foundThread) => {
					if (err || Object.keys(foundThread).length < 1) {
						return result({
							status: `Threads not found for board: ${data.board}`
						});
					} else {
						return result(foundThread);
					}
				});
		}
	});
};
