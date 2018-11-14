const express = require("express"),
	router = express.Router(),
	threadsController = require("../controllers/threadsController");

router.post("/threads/:board", threadsController.createThread);

router.get("/threads/:board", threadsController.getThreads);

router.put("/threads/:board", threadsController.reportThread);

router.delete("/threads/:board", threadsController.deleteThread);

module.exports = router;
