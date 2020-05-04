const mongoose = require("mongoose");

const DomainSchema = mongoose.Schema({
	// _id is the domain name
	_id: { type: String },
	totalReports: { type: String },
});

module.exports = mongoose.model("domain", DomainSchema, "domains");
