const mongoose = require("mongoose"),
	Reply = require("../models/replyModel"),
	Thread = require("../models/threadModel");

exports.createReply = (params, data) => {
	let thread, reply;
	return findSingleThreadData({ board: params.board, _id: data.thread_id })
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
			return reply;
		})
		.catch(err => {
			return Promise.reject(err);
		});
};

function findSingleThreadData(threadData) {
	return Thread.findOne(threadData)
		.select({ __v: 0, delete_password: 0, reported: 0 })
		.populate({
			path: "replies",
			select: { __v: 0, delete_password: 0, reported: 0 }
		})
		.exec()
		.then(foundThread => {
			if (foundThread) {
				return foundThread;
			} else {
				return Promise.reject({
					status: "Requested thread data not found"
				});
			}
		})
		.catch(err => {
			return Promise.reject({
				status: err.status ? err.status : "Error while retrieving thread data",
				error: err.message
			});
		});
}

function saveReplyData(replyData) {
	return Reply(replyData)
		.save()
		.then(savedReply => {
			return savedReply;
		})
		.catch(err => {
			return Promise.reject({
				status: "Error while saving reply",
				error: err.message
			});
		});
}

function updateThread(foundThread) {
	return foundThread
		.save()
		.then(updatedThread => {
			return updatedThread;
		})
		.catch(err => {
			return Promise.reject({
				status: "Error while updating thread",
				error: err.message
			});
		});
}

exports.getReplies = (params, data, result) => {
	return findSingleThreadData({ board: params.board, _id: data.thread_id })
		.then(result => {
			return result;
		})
		.catch(err => {
			return Promise.reject(err);
		});
};

exports.reportReply = (params, data, result) => {
	return findSingleThreadData({
		board: params.board,
		_id: data.thread_id,
		replies: data.reply_id
	})
		.then(foundThread => {
			return updateReplyData({ _id: data.reply_id }, { reported: true });
		})
		.then(result => {
			return result;
		})
		.catch(err => {
			return Promise.reject(err);
		});
};

function updateReplyData(replyFilters, updateData) {
	return Reply.findOneAndUpdate(
		replyFilters,
		{ $set: updateData },
		{ new: true }
	)
		.exec()
		.then(updatedReply => {
			if (updatedReply) {
				return { status: "Success" };
			} else {
				return Promise.reject({ status: "Reply data not found" });
			}
		})
		.catch(err => {
			return Promise.reject({
				status: err.status ? err.status : "Error while updating reply",
				error: err.message
			});
		});
}

exports.deleteReply = (params, data) => {
	return findSingleThreadData({ board: params.board, _id: data.thread_id })
		.then(foundThread => {
			return updateReplyData(
				{ _id: data.reply_id, delete_password: data.delete_password },
				{ text: "[deleted]" }
			);
		})
		.then(result => {
			return result;
		})
		.catch(err => {
			return Promise.reject(err);
		});
};
