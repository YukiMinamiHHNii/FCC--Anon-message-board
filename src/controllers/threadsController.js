const threadsDAO = require("../daos/threadsDAO");

exports.createThread = (req, res) => {
	threadsDAO.createThread(req.body, result=>{
		res.json(result);
	});
};

exports.getThreads = (req, res) => {
	threadsDAO.getThreads(req.query, result=>{
		res.json(result);
	});
};

exports.reportThread = (req, res) => {
	res.json({ status: "on threads PUT" });
};

exports.deleteThread = (req, res) => {
	res.json({ status: "on threads DELETE" });
};
