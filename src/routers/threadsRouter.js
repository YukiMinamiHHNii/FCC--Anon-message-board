const express = require("express"),
	router = express.Router(),
	threadsController = require("../controllers/threadsController");

router.post("/threads", threadsController.createThread);

router.get("/threads", threadsController.getThreads);

router.put("/threads", threadsController.reportThread);

router.delete("/threads", threadsController.deleteThread);

module.exports = router;
