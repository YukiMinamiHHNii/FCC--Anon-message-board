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

exports.createReply = (params, data, result) => {
	console.log(data);
	handleConnection((error, connected) => {
		if (!connected) {
			return result({ status: "Error while connecting to DB", error: error });
		} else {
			Thread.findOne({ board: params.board, _id: data.thread_id }).exec(
				(error, foundThread) => {
					if (error || !foundThread) {
						return result({
							status: "Requested thread not found",
							error: error //Remove this later
						});
					} else {
						Reply({
							text: data.reply_text,
							delete_password: data.delete_password,
							created_on: new Date()
						}).save((error, savedReply) => {
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
						});
					}
				}
			);
		}
	});
};

exports.getReplies = (params, data, result) => {
	handleConnection((error, connected) => {
		if (!connected) {
			return result({ status: "Error while connecting to DB", error: error });
		} else {
			Thread.find({ board: params.board, _id: data.thread_id })
				.select({ __v: 0, delete_password: 0, reported: 0 })
				.populate({
					path: "replies",
					select: { __v: 0, delete_password: 0, reported: 0 }
				})
				.exec((err, foundThread) => {
					if (err || Object.keys(foundThread).length < 1) {
						return result({ status: "Requested thread not found" });
					} else {
						return result(foundThread);
					}
				});
		}
	});
};

exports.reportReply = (params, data, result) => {
	handleConnection((error, connected) => {
		if (!connected) {
			return result({ status: "Error while connecting to DB", error: error });
		} else {
			Thread.findOne({
				board: params.board,
				_id: data.thread_id,
				replies: data.reply_id
			}).exec((err, foundThread) => {
				if (error || !foundThread) {
					return result({
						status:
							"Error while retrieving reply data... are your filters correct?"
					});
				} else {
					Reply.findOneAndUpdate(
						{ _id: data.reply_id },
						{ $set: { reported: true } },
						{ new: true }
					).exec((err, updatedReply) => {
						if (err || !updatedReply) {
							return result({
								status: `Error while reporting reply ${data.reply_id}`,
								error: err
							});
						} else {
							return result({ status: "Success" });
						}
					});
				}
			});
		}
	});
};

exports.deleteReply = (params, data, result) => {
	handleConnection((error, connected) => {
		if (!connected) {
			return result({ status: "Error while connecting to DB", error: error });
		} else {
			Thread.findOne({ board: params.board, _id: data.thread_id }).exec(
				(err, foundThread) => {
					if (err || !foundThread) {
						return result({ status: "Requested thread not found", error: err });
					} else {
						Reply.findOneAndUpdate(
							{ _id: data.reply_id, delete_password: data.delete_password },
							{ $set: { text: "[deleted]" } },
							{ new: true }
						).exec((err, updatedReply) => {
							if (err || !updatedReply) {
								return result({ status: "Incorrect password or reply ID" });
							} else {
								return result({ status: "Success" });
							}
						});
					}
				}
			);
		}
	});
};
