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
	res.json({ status: "on replies PUT" });
};

exports.deleteReply = (req, res) => {
	res.json({ status: "on replies DELETE" });
};
