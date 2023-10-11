const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");

const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");
const reservationsRouter = require("./reservations/reservations.router");
const dashboardRouter = require("./dashboard/dashboard.router");
const tablesRouter = require("./tables/tables.router");
const searchRouter = require("./search/search.router");


const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "front-end", "build")));

app.use("/dashboard", dashboardRouter);
app.use("/reservations", reservationsRouter);
app.use("/tables", tablesRouter);
app.use("/search", searchRouter);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "front-end", "build", "index.html"));
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
