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

const { getUsers } = require("./controllers/users");
const { admin } = require("./util/admin");

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

app.get("/users", getUsers);

exports.api = functions.https.onRequest(app);

exports.sendHealthReports = functions.firestore
  .document(`/reports/{uid}`)
  .onWrite((event) => {
    const type = event.after.get("reportType");

    if (type === "health") {
      admin
        .firestore()
        .collection("organizations")
        .get()
        .then((docs) => {
          const data = [];
          docs.forEach((doc) => {
            if (doc.data().notificationToken !== undefined) {
              data.push(doc.data().notificationToken);
            }
          });

          console.log(data);

          const message = {
            data: {
              title: "New Health Report",
              body:
                "New health report has be added and require special attention",
            },
            tokens: [...data],
          };

          admin
            .messaging()
            .sendMulticast(message)
            .then((response) => {
              console.log(
                response.successCount + " messages were sent successfully"
              );
              console.log(response.failureCount + " messages are failed");
            })

            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    }
  });
