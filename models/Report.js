const mongoose = require("mongoose");

const ReportSchema = mongoose.Schema({
	// _id is the page url
	_id: { type: String },
	reports: { type: Number, default: 0 },
});

module.exports = mongoose.model("report", ReportSchema, "reports");
