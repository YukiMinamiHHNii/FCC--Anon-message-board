const express = require("express"),
			router = express.Router(),
			repliesController = require("../controllers/repliesController");

router.post("/replies/:board", repliesController.createReply);

router.get("/replies/:board", repliesController.getReplies);

router.put("/replies/:board", repliesController.reportReply);

router.delete("/replies/:board", repliesController.deleteReply);

module.exports = router;
