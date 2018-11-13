const express = require("express"),
			router = express.Router();

router.get("/threads/:board", (req, res) => {
	res.json({ result: "on threads GET" });
});

router.post("/threads/:board", (req, res) => {
	res.json({ result: "on threads POST" });
});

router.put("/threads/:board", (req, res) => {
	res.json({ result: "on threads PUT" });
});

router.delete("/threads/:board", (req, res) => {
	res.json({ result: "on threads DELETE" });
});

module.exports = router;
