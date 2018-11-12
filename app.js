const express = require("express"),
	dotenv = require("dotenv").load(),
	bodyParser = require("body-parser");

const app = express();

app.set("view engine", "pug");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", (req, res) => {
	res.render("index");
});

app.listen(process.env.SERVER_PORT);

console.log(`App running on port ${process.env.SERVER_PORT}`);

module.exports = app;
