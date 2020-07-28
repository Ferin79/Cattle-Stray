const functions = require("firebase-functions");
const express = require("express");
const {
  getReports,
  getReportsByCoords,
  getReportsByReportId,
  getReportsByUserId,
} = require("./controllers/fetchReports");

const {
  getOrganization,
  addOrganization,
  deleteOrganization,
} = require("./controllers/manageOrganization");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH");
  next();
});

app.get("/reports", getReports);
app.get("/reports/coords/:lat/:lng/:radius", getReportsByCoords);
app.get("/reports/user/:id", getReportsByUserId);
app.get("/reports/:reportId", getReportsByReportId);

app.get("/organization", getOrganization);
app.post("/organization/add", addOrganization);
app.post("/organization/delete", deleteOrganization);

exports.api = functions.https.onRequest(app);
