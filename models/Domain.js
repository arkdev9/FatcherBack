const mongoose = require("mongoose");

const DomainSchema = mongoose.Schema({
	// _id is the domain name
	_id: { type: String },
	reports: { type: Number, default: 0 },
});

module.exports = mongoose.model("domain", DomainSchema, "domains");
