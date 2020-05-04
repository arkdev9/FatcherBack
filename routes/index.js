const url = require("url");
const express = require("express");
const Report = require("../models/Report");
const Domain = require("../models/Domain");
const router = express.Router();

const getDomain = (pageUrl) => url.parse(pageUrl).hostname;

// Endpoint for getting domain stats
router.get("/stats", (req, res, next) => {
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

module.exports = router;
