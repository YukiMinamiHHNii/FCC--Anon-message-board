const express = require("express"),
			router = express.Router();

router.get("/threads/:board", (req, res) => {
	res.json({ status: "on threads GET" });
});

router.post("/threads/:board", (req, res) => {
	res.json({ status: "on threads POST", data: req.body });
});

router.put("/threads/:board", (req, res) => {
	res.json({ status: "on threads PUT" });
});

router.delete("/threads/:board", (req, res) => {
	res.json({ status: "on threads DELETE" });
});

module.exports = router;
