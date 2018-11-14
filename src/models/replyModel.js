const mongoose = require("mongoose"),
			Schema = mongoose.Schema;

const replySchema = new Schema({
	text: { type: String, required: true },
	created_on: { type: Date, default: new Date() },
	delete_password: { type: String, required: true },
	reported: { type: Boolean, default: false }
});

module.exports = mongoose.model("Reply", replySchema);
