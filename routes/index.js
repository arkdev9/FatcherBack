const url = require("url");
const express = require("express");
const Report = require("../models/Report");
const Domain = require("../models/Domain");
const router = express.Router();

const getDomain = (pageUrl) => url.parse(pageUrl).hostname;

// Endpoint for getting domain stats
router.post("/stats", (req, res, next) => {
	const pageUrl = req.body.url;
	const domain = getDomain(pageUrl);
	let response = {};

	Domain.findById(domain)
		.then((doc) => {
			// We have the doc, return the number of reports on domain
			response.domainReports = doc.reports;
			res.status(200).json(response);
		})
		.catch((err) => {
			// Failed to get the document, probably the domain doesn't exist on our db
			console.log("Failed to serve a domain: " + domain + ", because: " + err);
			res.status(400).json({ err: err });
		});
});

// Endpoint for reporting
router.post("/report", (req, res) => {
	const pageUrl = req.body.url;
	const domain = getDomain(pageUrl);

	// Check if domain already exists
	Domain.findByIdAndUpdate(domain, { $inc: { reports: 1 } })
		.then((doc) => {
			if (!doc) {
				// Doc doesn't exist, create one for this domain
				Domain.create({ _id: domain })
					.then((doc) => {
						if (!doc) throw { message: "Couldn't create a Domain report" };
						res
							.status(201)
							.json({ messgae: "Created a domain report for this domain" });
					})
					.catch((err) => {
						res.status(500).json({ err: err });
					});
			} else {
				// Updated, return new stats
				res.status(200).send("Updated successfully, new count: " + doc.reports);
			}
		})
		.catch((err) => {
			console.log("Couldn't report on a domain: " + err);
			res.status(500).json({ err: err });
		});
});

module.exports = router;
