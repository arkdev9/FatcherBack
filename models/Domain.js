const mongoose = require("mongoose");

const DomainSchema = mongoose.Schema({
	// _id is the domain name
	_id: { type: String },
	reports: { type: Number, default: 1 },
	pathReports: {
		type: [
			{
				path: String,
				users: {
					type: [String],
					default: [],
				},
			},
		],
	},
});

DomainSchema.methods.incrementPathReport = function (path, user) {
	// Find if the path exists
	for (let i = 0; i < this.pathReports.length; i++) {
		// TODO: eww, linear search
		if (this.pathReports[i].path === path) {
			// Path exists, check if user already submitted a report.
			// Loop through its paths to see if any of the reports are the users names
			for (let j = 0; j < this.pathReports[i].users.length; j++) {
				// If user found
				if (this.pathReports[i].users[j] === user) {
					// User already found
					console.log("User report already submitted at this path");
					return;
				}
			}
			// If we get here, it means that the user hasn't submitted a report on this path
			// Increment domain reports
			this.reports += 1;
			// Push user to pathReports.users which stores all usernames that reported this page
			this.pathReports[i].users.push(user);
			return;
		}
	}
	// We didn't find any path report for that path :(
	this.pathReports.push({ path: path, users: [user] });
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
