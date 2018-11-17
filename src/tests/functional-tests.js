const chaiHttp = require("chai-http"),
	chai = require("chai"),
	assert = chai.assert,
	app = require(`${process.cwd()}/app`);

chai.use(chaiHttp);

let threadID, replyID;

suite("Functional Tests", () => {
	suite("API ROUTING FOR /api/threads/:board (except delete)", () => {
		suite("POST", () => {
			test("Create thread", done => {
				chai
					.request(app)
					.post("/api/threads/test")
					.type("form")
					.send({
						thread_text: "Thread POST test",
						delete_password: "testPassword"
					})
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.isNotNull(res.body._id, "Thread ID is not null");
						assert.equal(res.body.text, "Thread POST test");
						assert.isNotNull(
							res.body.created_on,
							"Date of creation is not null"
						);
						assert.isNotNull(
							res.body.bumped_on,
							"Bumping date is not null either"
						);
						assert.isFalse(
							res.body.reported,
							"When created, thread is not reported"
						);
						assert.equal(res.body.delete_password, "testPassword");
						assert.isArray(
							res.body.replies,
							"Threas has an empty replies array"
						);
						threadID = res.body._id;
						done();
					});
			});
		});

		suite("GET", () => {
			test("Get thread list", done => {
				chai
					.request(app)
					.get("/api/threads/test")
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.isArray(res.body, "Response is an array of threads");
						assert.isNotEmpty(
							res.body,
							"Should have at least thread created on previous test"
						);
						done();
					});
			});
		});

		suite("PUT", () => {
			test("Report thread", done => {
				chai
					.request(app)
					.put("/api/threads/test")
					.type("form")
					.send({ thread_id: threadID })
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.equal(res.body.status, "Success");
						done();
					});
			});
		});
	});

	suite("API ROUTING FOR /api/replies/:board", () => {
		suite("POST", () => {
			test("Reply to thread", done => {
				chai
					.request(app)
					.post("/api/replies/test")
					.type("form")
					.send({
						thread_id: threadID,
						reply_text: "Reply POST test",
						delete_password: "replyTestPassword"
					})
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.isNotNull(res.body._id, "Reply ID is not null");
						assert.equal(res.body.text, "Reply POST test");
						assert.equal(res.body.delete_password, "replyTestPassword");
						assert.isFalse(
							res.body.reported,
							"When created, replies are not reported"
						);
						assert.isNotNull(
							res.body.created_on,
							"Reply creation date is not null"
						);
						replyID = res.body._id;
						done();
					});
			});
		});

		suite("GET", () => {
			test("Get list of replies from thread", done => {
				chai
					.request(app)
					.get("/api/replies/test")
					.query({ thread_id: threadID })
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.isArray(res.body, "Response is an array of replies");
						assert.isNotEmpty(
							res.body,
							"Should have at least reply created on previous test"
						);
						done();
					});
			});
		});

		suite("PUT", () => {
			test("Report reply", done => {
				chai
					.request(app)
					.put("/api/replies/test")
					.type("form")
					.send({ thread_id: threadID, reply_id: replyID })
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.equal(res.body.status, "Success");
						done();
					});
			});
		});

		suite("DELETE", () => {
			test("Delete reply", done => {
				chai
					.request(app)
					.delete("/api/replies/test")
					.type("form")
					.send({ thread_id: threadID, reply_id: replyID, delete_password: "replyTestPassword" })
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.equal(res.body.status, "Success");
						done();
					});
			});
		});
	});

	suite("API ROUTING FOR /api/threads/:board - DELETE operation", () => {
		suite("DELETE", () => {
			test("Delete thread", done => {
				chai
					.request(app)
					.delete("/api/threads/test")
					.type("form")
					.send({ thread_id: threadID, delete_password: "testPassword" })
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.equal(res.body.status, "Success");
						done();
					});
			});
		});
	});
});
