const repliesDAO = require("../daos/repliesDAO");

exports.createReply = (req, res) => {
	repliesDAO
		.createReply(req.params, req.body)
		.then(result => {
			return res.json(result);
		})
		.catch(err => {
			return res.json(err);
		});
};

exports.getReplies = (req, res) => {
	repliesDAO
		.getReplies(req.params, req.query)
		.then(result => {
			return res.json(result);
		})
		.catch(err => {
			return res.json(err);
		});
};

exports.reportReply = (req, res) => {
	repliesDAO
		.reportReply(req.params, req.body)
		.then(result => {
			return res.json(result);
		})
		.catch(err => {
			return res.json(err);
		});
};

exports.deleteReply = (req, res) => {
	repliesDAO
		.deleteReply(req.params, req.body)
		.then(result => {
			return res.json(result);
		})
		.catch(err => {
			return res.json(err);
		});
};
