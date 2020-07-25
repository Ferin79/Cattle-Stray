const firebase = require("firebase");
const firebase_admin = require("firebase-admin");
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors")({ origin: true });

var firebaseConfig = {
  apiKey: "AIzaSyAUbEG1L49COARLWsivHYPc1lmTU5hIxd4",
  authDomain: "cattle-stray.firebaseapp.com",
  databaseURL: "https://cattle-stray.firebaseio.com",
  projectId: "cattle-stray",
  storageBucket: "cattle-stray.appspot.com",
  messagingSenderId: "1080865857229",
  appId: "1:1080865857229:web:64194fe1d2e95da5ca5384",
  measurementId: "G-9NQ6FMZYQ7"
};
// Initialize Firebase
firebase_admin.initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);

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

// On delete user
exports.userDeleted = functions.auth.user().onDelete((user) => {
  const doc = admin.firestore().collection("users").doc(user.uid);
  return doc.delete();
});
// Get reports
exports.getReports = functions.https.onRequest((request, response) => {
  return cors(request, response, () => {
    firebase.firestore().collection("reports").get().then((snapshot) => {    
      response.status(200).send({ data: snapshot.docs });
    })
  });
});

// Express fun - Get reports
exports.expressGetReports = (request, response) => {  
  firebase.firestore().collection("reports").get().then((snapshot) => {    
    let reports = [];
    snapshot.docs.forEach((doc) => {
      reports.push(doc.data());
    })
    response.status(200).json({ data: reports });
  });  
};

// Express fun - Add Organization
exports.addOrganization = (request, response) => {  

  const { email, password, name, type } = request.body;
  const role = "organization";

  firebase.auth()
    .createUserWithEmailAndPassword(email, password)
    .then((data) => {
      const uid = data.user.uid
      const createdAt = firebase.firestore.Timestamp.now()
      return firebase.firestore().collection("users").add({
        name,
        email,
        type,
        uid,
        role,
        createdAt
      })
    })
    .then(() => {
      return response.status(200).json({
        success: true,        
      });
    })
    .catch((error) => {
      console.log(error);
      response.status(500).json({
        success: false,
        error: error.message,
      });
    });
};

app.post("/addOrganization", this.addOrganization);
app.get("/getReports", this.expressGetReports);

exports.api = functions.https.onRequest(app);
