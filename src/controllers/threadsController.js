const threadsDAO = require("../daos/threadsDAO");

exports.createThread = (req, res) => {
	threadsDAO
		.createThread(req.params, req.body)
		.then(result => {
			return res.json(result);
		})
		.catch(err => {
			return res.json(err);
		});
};

exports.getThreads = (req, res) => {
	threadsDAO
		.getThreads(req.params)
		.then(result => {
			return res.json(result);
		})
		.catch(err => {
			return res.json(err);
		});
};

exports.reportThread = (req, res) => {
	threadsDAO
		.reportThread(req.params, req.body)
		.then(result => {
			return res.json(result);
		})
		.catch(err => {
			return res.json(err);
		});
};

exports.deleteThread = (req, res) => {
	threadsDAO
		.deleteThread(req.params, req.body)
		.then(result => {
			return res.json(result);
		})
		.catch(err => {
			return res.json(err);
		});
};
