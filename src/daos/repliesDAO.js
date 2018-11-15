const mongoose = require("mongoose"),
	dotenv = require("dotenv").load(),
	Reply = require("../models/replyModel"),
	Thread = require("../models/threadModel");

function handleConnection(connected) {
	mongoose.connect(
		process.env.MONGO_DB_CONNECTION,
		err => {
			return err ? connected(err, false) : connected(null, true);
		}
	);
}

exports.createReply = (data, result) => {
	handleConnection((error, connected) => {
		if (!connected) {
			return result({ status: "Error while connecting to DB", error: error });
		} else {
			Thread.findOne({ _id: data.thread, board: data.board }).exec(
				(error, foundThread) => {
					if (error || !foundThread) {
						return result({
							status: "Requested thread not found",
							error: error //Remove this later
						});
					} else {
						Reply({ text: data.reply, delete_password: data.password, created_on: new Date() }).save(
							(error, savedReply) => {
								if (error) {
									return result({
										status: "Error while saving reply",
										error: error
									});
								} else {
									foundThread.replies.push(savedReply._id);
									foundThread.bumped_on = new Date();
									foundThread.save((error, updatedData) => {
										if (error) {
											return result({
												status: "Error while updating thread",
												error: error
											});
										} else {
											return result(savedReply);
										}
									});
								}
							}
						);
					}
				}
			);
		}
	});
};
