const url = require("url");
const express = require("express");
const Report = require("../models/Report");
const Domain = require("../models/Domain");
const router = express.Router();

const getDomain = (pageUrl) => url.parse(pageUrl).hostname;

// Endpoint for getting domain stats
router.post("/stats", (req, res) => {
	const pageUrl = req.body.url;
	const domain = getDomain(pageUrl);
	let response = {};

	Domain.findById(domain)
		.then((doc) => {
			if (!doc) {
				// Create doc
				Domain.create({ _id: domain })
					.then((doc) => {
						response.domainReports = doc.reports;
						response.message = "Created a document for this domain";
						res.status(201).json(response);
					})
					.catch((err) => {
						response.message = "Couldn't create a domain for this new domain";
						response.err = err;
						res.status(500).json(response);
					});
			} else {
				// We have the doc, return the number of reports on domain
				response.domainReports = doc.reports;
				res.status(200).json(response);
			}
		})
		.catch((err) => {
			// Failed to get the document, probably the domain doesn't exist on our db
			console.log("Failed to serve a domain: " + domain + ", because: " + err);
			res.status(500).send(err);
		});
});

// Endpoint for reporting
router.post("/report", (req, res) => {
	const pageUrl = req.body.url;
	const domain = getDomain(pageUrl);
	let response = {};

	// Check if domain already exists
	Domain.findByIdAndUpdate(domain, { $inc: { reports: 1 } })
		.then((doc) => {
			if (!doc) {
				// Doc doesn't exist, create one for this domain
				Domain.create({ _id: domain })
					.then((doc) => {
						if (!doc) throw { message: "Couldn't create a Domain report" };
						response.domainReports = 1;
						response.message = "Created a domain report for this domain";
						res.status(201).json(response);
					})
					.catch((err) => {
						res.status(500).send(err);
					});
			} else {
				// Updated, return new stats
				response.domainReports = doc.reports;
				response.message = "Updated the document";
				res.status(200).json(response);
			}
		})
		.catch((err) => {
			console.log("Couldn't report on a domain: " + err);
			res.status(500).send(err);
		});
});

module.exports = router;
