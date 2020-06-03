const url = require("url");
const express = require("express");
const Domain = require("../models/Domain");
const router = express.Router();

// Endpoint for getting stats
router.post("/stats", (req, res) => {
	const reqUrl = url.parse(req.body.url);
	const domain = reqUrl.hostname;
	const path = reqUrl.pathname;

	Domain.findById(domain)
		.then((doc) => {
			if (!doc) {
				// Domain doesn't exist
				res.status(200).json({
					domainReports: 0,
					pathReports: 0,
					message: "No reports on this domain",
				});
			} else {
				// We have the doc, return the number of reports on domain
				// If no page reports, send 0
				let pageReport = doc.getPathReport(path);
				res.status(200).json({
					domainReports: doc.reports,
					pathReports: pageReport ? pageReport.users.length : 0,
					message: "Domain stats",
				});
			}
		})
		.catch((err) => {
			// Failed to get the document
			console.log("Failed to serve a domain: " + domain + ", because: " + err);
			res.status(500).send(err);
		});
});

// Endpoint for reporting
router.post("/report", (req, res) => {
	const user = req.body.user;
	const reqUrl = url.parse(req.body.url);
	const domain = reqUrl.hostname;
	const path = reqUrl.pathname;

	// Check if domain already exists
	Domain.findById(domain)
		.then((doc) => {
			if (!doc) {
				// Doc doesn't exist, create one for this domain
				let newDoc = new Domain({
					_id: domain,
					reports: 0,
					pathReports: [],
				});

				newDoc.reports = 1;
				newDoc.pathReports = [{ path: path, users: [user] }];

				newDoc.save((err, createdDoc) => {
					if (err) res.status(500).json({ err });
					else {
						res.status(201).json({
							domainReports: createdDoc.reports,
							pathReports: createdDoc.getPathReport(path).users.length,
							message: "Created a document for domain",
						});
					}
				});
			} else {
				// Found the document, increment domain reports
				doc.incrementPathReport(path, user);
				doc.save((err, updatedDoc) => {
					if (err) res.status(500).json({ err });
					else {
						res.status(200).json({
							domainReports: updatedDoc.reports,
							pathReports: updatedDoc.getPathReport(path).users.length,
							message: "Updated domain report",
						});
					}
				});
			}
		})
		.catch((err) => {
			console.log("Couldn't report on a domain: " + err);
			res.status(500).json({ err });
		});
});

module.exports = router;
