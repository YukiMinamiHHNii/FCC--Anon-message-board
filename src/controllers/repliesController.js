const repliesDAO = require("../daos/repliesDAO");

exports.createReply = (req, res) => {
	repliesDAO.createReply(req.params, req.body, result => {
		res.json(result);
	});
};

exports.getReplies = (req, res) => {
	repliesDAO.getReplies(req.params, req.query, result=>{
		res.json(result);
	});
};

exports.reportReply = (req, res) => {
	repliesDAO.reportReply(req.params, req.body, result=>{
		res.json(result);
	});
};

exports.deleteReply = (req, res) => {
	repliesDAO.deleteReply(req.params, req.body, result=>{
		res.json(result);
	});
};
