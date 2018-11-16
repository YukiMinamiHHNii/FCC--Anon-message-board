const express = require("express"),
	router = express.Router(),
	multer = require("multer"),
	upload = multer(),
	threadsController = require("../controllers/threadsController");

router.post("/threads/:board", upload.none(), threadsController.createThread);

router.get("/threads/:board", upload.none(), threadsController.getThreads);

router.put("/threads/:board", upload.none(), threadsController.reportThread);

router.delete("/threads/:board", upload.none(), threadsController.deleteThread);

module.exports = router;
