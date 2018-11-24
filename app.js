const express = require("express"),
	dotenv = require("dotenv").load(),
	bodyParser = require("body-parser"),
	methodOver = require("method-override"),
	helmet = require("helmet"),
	connection = require("./src/utils/connection"),
	threadsRouter = require("./src/routers/threadsRouter"),
	repliesRouter = require("./src/routers/repliesRouter");

const app = express();

connection.handleConnection();

app.set("view engine", "pug");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	methodOver((req, res) => {
		if (req.body._method) {
			let method = req.body._method;
			delete req.body._method;
			return method;
		}
	})
);

app.use(helmet.frameguard({ action: "sameorigin" }));
app.use(helmet.dnsPrefetchControl({ allow: false }));
app.use(helmet.referrerPolicy({ policy: "same-origin" }));

app.use("/api", threadsRouter);
app.use("/api", repliesRouter);

app.use("/", (req, res) => {
	res.render("index");
});

app.listen(process.env.SERVER_PORT);

console.log(`App running on port ${process.env.SERVER_PORT}`);

module.exports = app;
