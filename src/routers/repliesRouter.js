const express = require("express"),
			router = express.Router(),
			repliesController = require("../controllers/repliesController");

router.post("/replies", repliesController.createReply);

router.get("/replies", repliesController.getReplies);

router.put("/replies", repliesController.reportReply);

router.delete("/replies", repliesController.deleteReply);

module.exports = router;
