const mongoose = require("mongoose"),
			Schema = mongoose.Schema,
			Reply = require("./replyModel");

const threadSchema = new Schema({
	board: { type: String, required: true, unique: true },
	text: { type: String, required: true },
	created_on: { type: Date, default: new Date() },
	bumped_on: { type: Date, default: new Date() },
	reported: { type: Boolean, default: false },
	delete_password: { type: String, required: true },
	replies: [{ type: Schema.Types.ObjectId, ref: "Reply" }]
});

module.exports = mongoose.model("Thread", threadSchema);
