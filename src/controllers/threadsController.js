const threadsDAO = require("../daos/threadsDAO");

exports.createThread = (req, res) => {
	threadsDAO.createThread(req.body, result=>{
		res.json(result);
	});
};

exports.getThreads = (req, res) => {
	res.json({ status: "on threads GET" });
};

exports.reportThread = (req, res) => {
	res.json({ status: "on threads PUT" });
};

exports.deleteThread = (req, res) => {
	res.json({ status: "on threads DELETE" });
};
