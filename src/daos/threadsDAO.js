const mongoose = require("mongoose"),
	Thread = require("../models/threadModel"),
	Reply = require("../models/replyModel")

exports.createThread = (params, data) => {
	return new Promise((resolve, reject) => {
		saveThreadData({
			board: params.board,
			text: data.thread_text,
			delete_password: data.delete_password
		})
			.then(result => {
				resolve(result);
			})
			.catch(err => {
				reject(err);
			});
	});
};

function saveThreadData(threadData) {
	return new Promise((resolve, reject) => {
		Thread(threadData)
			.save()
			.then(savedThread => {
				resolve(savedThread);
			})
			.catch(err => {
				reject({ status: "Error while saving new thread", error: err.message });
			});
	});
}

exports.getThreads = params => {
	return new Promise((resolve, reject) => {
		getAllThreadsData(params.board)
			.then(result => {
				resolve(result);
			})
			.catch(err => {
				reject(err);
			});
	});
};

function getAllThreadsData(board) {
	return new Promise((resolve, reject) => {
		Thread.find({ board: board })
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
					resolve(foundThreads);
				} else {
					reject({
						status: `Threads not found for board ${board}`
					});
				}
			})
			.catch(err => {
				reject({
					status: `Threads not found for board ${board}`,
					error: err.message
				});
			});
	});
}

exports.reportThread = (params, data, result) => {
	return new Promise((resolve, reject) => {
		updateThreadData(params.board, data.thread_id)
			.then(result => {
				resolve(result);
			})
			.catch(err => {
				reject(err);
			});
	});
};

function updateThreadData(board, threadId) {
	return new Promise((resolve, reject) => {
		Thread.findOneAndUpdate(
			{ board: board, _id: threadId },
			{ $set: { reported: true } },
			{ new: true }
		)
			.exec()
			.then(updatedThread => {
				if (updatedThread) {
					resolve({ status: "Success" });
				} else {
					reject({
						status: `Thread ${threadId} not found in board ${board}`
					});
				}
			})
			.catch(err => {
				reject({
					status: `Thread ${threadId} not found in board ${board}`,
					error: err.message
				});
			});
	});
}

exports.deleteThread = (params, data, result) => {
	return new Promise((resolve, reject) => {
		deleteThreadData(params.board, data.thread_id, data.delete_password)
			.then(deletedThread => {
				return deleteLinkedRepliesData(deletedThread.replies);
			})
			.then(result => {
				resolve(result);
			})
			.catch(err => {
				reject(err);
			});
	});
};

function deleteThreadData(board, threadId, password) {
	return new Promise((resolve, reject) => {
		Thread.findOneAndDelete({
			board: board,
			_id: threadId,
			delete_password: password
		})
			.exec()
			.then(deletedThread => {
				if (deletedThread) {
					resolve(deletedThread);
				} else {
					reject({ status: "Incorrect password or thread ID" });
				}
			})
			.catch(err => {
				reject({
					status: `Error while deleting thread ${threadId}`,
					error: err.message
				});
			});
	});
}

function deleteLinkedRepliesData(replyIds) {
	return new Promise((resolve, reject) => {
		Reply.deleteMany({ _id: { $in: replyIds } })
			.exec()
			.then(() => {
				resolve({ status: "Success" });
			})
			.catch(err => {
				reject({
					status: "Error while deleting linked replies",
					error: err.message
				});
			});
	});
}
