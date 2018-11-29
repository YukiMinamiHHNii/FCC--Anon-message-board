const mongoose = require("mongoose"),
	Thread = require("../models/threadModel"),
	Reply = require("../models/replyModel");

exports.createThread = (params, data) => {
	return saveThreadData({
		board: params.board,
		text: data.thread_text,
		delete_password: data.delete_password
	})
		.then(result => {
			return result;
		})
		.catch(err => {
			return Promise.reject(err);
		});
};

function saveThreadData(threadData) {
	return Thread(threadData)
		.save()
		.then(savedThread => {
			return savedThread;
		})
		.catch(err => {
			return Promise.reject({
				status: "Error while saving new thread",
				error: err.message
			});
		});
}

exports.getThreads = params => {
	return getAllThreadsData(params.board)
		.then(result => {
			return result;
		})
		.catch(err => {
			return Promise.reject(err);
		});
};

function getAllThreadsData(board) {
	return Thread.find({ board: board })
		.sort({ created_on: -1 })
		.limit(10)
		.select({ __v: 0, delete_password: 0, reported: 0 })
		.populate({
			path: "replies",
			select: { __v: 0, delete_password: 0, reported: 0 },
			options: { limit: 3, sort: { created_on: -1 } }
		})
		.exec()
		.then(foundThreads => {
			if (foundThreads.length > 0) {
				return foundThreads;
			} else {
				return Promise.reject({
					status: `Threads not found for board ${board}`
				});
			}
		})
		.catch(err => {
			return Promise.reject({
				status: err.status
					? err.status
					: `Threads not found for board ${board}`,
				error: err.message
			});
		});
}

exports.reportThread = (params, data, result) => {
	return updateThreadData(params.board, data.thread_id)
		.then(result => {
			return result;
		})
		.catch(err => {
			return Promise.reject(err);
		});
};

function updateThreadData(board, threadId) {
	return Thread.findOneAndUpdate(
		{ board: board, _id: threadId },
		{ $set: { reported: true } },
		{ new: true }
	)
		.exec()
		.then(updatedThread => {
			if (updatedThread) {
				return { status: "Success" };
			} else {
				return Promise.reject({
					status: `Thread ${threadId} not found in board ${board}`
				});
			}
		})
		.catch(err => {
			return Promise.reject({
				status: `Thread ${threadId} not found in board ${board}`,
				error: err.message
			});
		});
}

exports.deleteThread = (params, data, result) => {
	return deleteThreadData(params.board, data.thread_id, data.delete_password)
		.then(deletedThread => {
			return deleteLinkedRepliesData(deletedThread.replies);
		})
		.then(result => {
			return result;
		})
		.catch(err => {
			return Promise.reject(err);
		});
};

function deleteThreadData(board, threadId, password) {
	return Thread.findOneAndDelete({
		board: board,
		_id: threadId,
		delete_password: password
	})
		.exec()
		.then(deletedThread => {
			if (deletedThread) {
				return deletedThread;
			} else {
				return Promise.reject({ status: "Incorrect password or thread ID" });
			}
		})
		.catch(err => {
			return Promise.reject({
				status: err.status
					? err.status
					: `Error while deleting thread ${threadId}`,
				error: err.message
			});
		});
}

function deleteLinkedRepliesData(replyIds) {
	return Reply.deleteMany({ _id: { $in: replyIds } })
		.exec()
		.then(() => {
			return { status: "Success" };
		})
		.catch(err => {
			return Promise.reject({
				status: "Error while deleting linked replies",
				error: err.message
			});
		});
}
