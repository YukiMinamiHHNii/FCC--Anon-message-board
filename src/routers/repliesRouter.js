const express = require("express"),
	router = express.Router(),
	multer = require("multer"),
	upload = multer(),
	repliesController = require("../controllers/repliesController");

router.post("/replies/:board", upload.none(), repliesController.createReply);

router.get("/replies/:board", upload.none(), repliesController.getReplies);

router.put("/replies/:board", upload.none(), repliesController.reportReply);

router.delete("/replies/:board", upload.none(), repliesController.deleteReply);

router.use((req, res) => {
	res
		.status(404)
		.type("json")
		.send({ status: "Not found" });
});

module.exports = router;
