const { admin } = require("../util/admin");
const firebase = require("firebase");
const geofirestore = require("geofirestore");
const config = require("../util/config");

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

exports.getReports = (req, res) => {
  admin
    .firestore()
    .collection("reports")
    .where("isRejected", "==", false)
    .where("isResolved", "==", false)
    .orderBy("createdAt", "desc")
    .get()
    .then((docs) => {
      const data = [];
      docs.forEach((doc) => {
        data.push({
          ...doc.data(),
          id: doc.id,
          createdAt: doc.data().createdAt.toDate().toLocaleString(),
        });
      });

      res.status(200).json({
        success: true,
        data: {
          count: data.length,
          reports: data,
        },
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    });
};

exports.getReportsByCoords = (req, res, next) => {
  const firestore = firebase.firestore();
  const GeoFirestore = geofirestore.initializeApp(firestore);
  const geocollection = GeoFirestore.collection("reports");

  const { lat, lng, radius } = req.params;

  const query = geocollection.near({
    center: new firebase.firestore.GeoPoint(Number(lat), Number(lng)),
    radius: Number(radius),
  });

  query
    .get()
    .then((value) => {
      const data = [];
      value.docs.forEach((doc) => {
        if (
          doc.data().isRejected === false &&
          doc.data().isResolved === false &&
          doc.data().reportType === "general"
        ) {
          data.push({
            ...doc.data(),
            id: doc.id,
            createdAt: doc.data().createdAt.toDate().toLocaleString(),
          });
        }
      });
      res.status(200).json({
        success: true,
        data: {
          count: data.length,
          reports: data,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    });
};

exports.getReportsByReportId = (req, res, next) => {
  const { reportId } = req.params;

  admin
    .firestore()
    .doc(`/reports/${reportId}`)
    .get()
    .then((doc) => {
      res.status(200).json({
        success: true,
        data: {
          count: 1,
          report: {
            ...doc.data(),
            id: doc.id,
            createdAt: doc.data().createdAt.toDate().toLocaleString(),
          },
        },
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    });
};

exports.getReportsByUserId = (req, res, next) => {
  const { id } = req.params;

  admin
    .firestore()
    .collection("reports")
    .where("uid", "==", id)
    .get()
    .then((docs) => {
      const data = [];
      docs.forEach((doc) => {
        data.push({
          ...doc.data(),
          id: doc.id,
          createdAt: doc.data().createdAt.toDate().toLocaleString(),
        });
      });

      res.status(200).json({
        success: true,
        data: {
          count: data.length,
          reports: data,
        },
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    });
};
