require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var cors = require("cors");

var indexRouter = require("./routes/index");

var app = express();

// DB Connection
mongoose
	.connect(process.env.MONGO_CONNECT_URI, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	})
	.then((val) => {
		console.log("Connected to Laniakea");
	})
	.catch((err) => {
		console.log("Couldn't connect to Laniakea: " + err);
	});

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	console.log({ err: res.locals.error, msg: res.locals.message });
	res.send("Errored at server, please check dev logs");
});

module.exports = app;
