const chaiHttp = require("chai-http"),
	chai = require("chai"),
	assert = chai.assert,
	app = require(`${process.cwd()}/app`);

chai.use(chaiHttp);

suite("Functional Tests", () => {
	suite("API ROUTING FOR /api/threads/:board", () => {
		suite("POST", () => {});

		suite("GET", () => {});

		suite("DELETE", () => {});

		suite("PUT", () => {});
	});

	suite("API ROUTING FOR /api/replies/:board", () => {
		suite("POST", () => {});

		suite("GET", () => {});

		suite("PUT", () => {});

		suite("DELETE", () => {});
	});
});
