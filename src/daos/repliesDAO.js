const mongoose = require("mongoose"),
	Reply = require("../models/replyModel"),
	Thread = require("../models/threadModel");

exports.createReply = (params, data) => {
	return new Promise((resolve, reject) => {
		let thread, reply;
		findSingleThreadData({ board: params.board, _id: data.thread_id })
			.then(foundThread => {
				thread = foundThread;
				return saveReplyData({
					text: data.reply_text,
					delete_password: data.delete_password,
					created_on: new Date()
				});
			})
			.then(savedReply => {
				reply = savedReply;
				thread.replies.push(savedReply._id);
				thread.bumped_on = new Date();
				return updateThread(thread);
			})
			.then(updatedThread => {
				resolve(reply);
			})
			.catch(err => {
				reject(err);
			});
	});
};

function findSingleThreadData(threadData) {
	return new Promise((resolve, reject) => {
		Thread.findOne(threadData)
			.select({ __v: 0, delete_password: 0, reported: 0 })
			.populate({
				path: "replies",
				select: { __v: 0, delete_password: 0, reported: 0 }
			})
			.exec()
			.then(foundThread => {
				if (foundThread) {
					resolve(foundThread);
				} else {
					reject({
						status: "Requested thread data not found"
					});
				}
			})
			.catch(err => {
				reject({
					status: "Error while retrieving thread data",
					error: err.message
				});
			});
	});
}

function saveReplyData(replyData) {
	return new Promise((resolve, reject) => {
		Reply(replyData)
			.save()
			.then(savedReply => {
				resolve(savedReply);
			})
			.catch(err => {
				reject({
					status: "Error while saving reply",
					error: err.message
				});
			});
	});
}

function updateThread(foundThread) {
	return new Promise((resolve, reject) => {
		foundThread
			.save()
			.then(updatedThread => {
				resolve(updatedThread);
			})
			.catch(err => {
				reject({
					status: "Error while updating thread",
					error: err.message
				});
			});
	});
}

exports.getReplies = (params, data, result) => {
	return new Promise((resolve, reject) => {
		findSingleThreadData({ board: params.board, _id: data.thread_id })
			.then(result => {
				resolve(result);
			})
			.catch(err => {
				reject(err);
			});
	});
};

exports.reportReply = (params, data, result) => {
	return new Promise((resolve, reject) => {
		findSingleThreadData({
			board: params.board,
			_id: data.thread_id,
			replies: data.reply_id
		})
			.then(foundThread => {
				return updateReplyData({ _id: data.reply_id }, { reported: true });
			})
			.then(result => {
				resolve(result);
			})
			.catch(err => {
				reject(err);
			});
	});
};

function updateReplyData(replyFilters, updateData) {
	return new Promise((resolve, reject) => {
		Reply.findOneAndUpdate(replyFilters, { $set: updateData }, { new: true })
			.exec()
			.then(updatedReply => {
				if (updatedReply) {
					resolve({ status: "Success" });
				} else {
					reject({ status: "Reply data not found" });
				}
			})
			.catch(err => {
				reject({
					status: "Error while updating reply",
					error: err.message
				});
			});
	});
}

exports.deleteReply = (params, data) => {
	return new Promise((resolve, reject) => {
		findSingleThreadData({ board: params.board, _id: data.thread_id })
			.then(foundThread => {
				return updateReplyData(
					{ _id: data.reply_id, delete_password: data.delete_password },
					{ text: "[deleted]" }
				);
			})
			.then(result => {
				resolve(result);
			})
			.catch(err => {
				reject(err);
			});
	});
};
