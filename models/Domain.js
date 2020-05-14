const mongoose = require("mongoose");

const DomainSchema = mongoose.Schema({
	// _id is the domain name
	_id: { type: String },
	reports: { type: Number, default: 1 },
	pathReports: {
		type: [{ path: String, reports: { type: Number, default: 1 } }],
	},
});

DomainSchema.methods.incrementPathReport = function (path) {
	// Find if the path exists
	for (let i = 0; i < this.pathReports.length; i++) {
		// TODO: eww, linear search
		if (this.pathReports[i].path === path) {
			this.pathReports[i].reports += 1;
			return;
		}
	}
	// We didn't find any path report for that path :(
	this.pathReports.push({ path: path, reports: 1 });
};

DomainSchema.methods.getPathReport = function (path) {
	for (let i = 0; i < this.pathReports.length; i++) {
		if (this.pathReports[i].path === path) {
			return this.pathReports[i];
		}
	}
	return false;
};

module.exports = mongoose.model("domain", DomainSchema, "domains");
