const express = require("express"),
			router = express.Router();

router.post("/replies/:board", (req, res) => {
	res.json({ status: "on replies POST" });
});

router.get("/replies/:board", (req, res) => {
	res.json({ status: "on replies GET" });
});

router.put("/replies/:board", (req, res) => {
	res.json({ status: "on replies PUT" });
});

router.delete("/replies/:board", (req, res) => {
	res.json({ status: "on replies DELETE" });
});

module.exports = router;
