const threadsDAO = require("../daos/threadsDAO");

exports.createThread = (req, res) => {
	console.log(req);
	threadsDAO.createThread(req.params, req.body, result=>{
		res.json(result);
	});
};

exports.getThreads = (req, res) => {
	threadsDAO.getThreads(req.params, result=>{
		res.json(result);
	});
};

exports.reportThread = (req, res) => {
	threadsDAO.reportThread(req.params, req.body, result=>{
		res.json(result);
	});
};

exports.deleteThread = (req, res) => {
	threadsDAO.deleteThread(req.params, req.body, result=>{
		res.json(result);
	});
};
