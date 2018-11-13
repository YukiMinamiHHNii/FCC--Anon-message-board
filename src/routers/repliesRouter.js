const express = require("express"),
			router = express.Router();

router.get("/replies/:board", (req, res) => {
	res.json({ status: "on replies GET" });
});

router.post("/replies/:board", (req, res) => {
	res.json({ status: "on replies POST" });
});

router.put("/replies/:board", (req, res) => {
	res.json({ status: "on replies PUT" });
});

router.delete("/replies/:board", (req, res) => {
	res.json({ status: "on replies DELETE" });
});

module.exports = router;
