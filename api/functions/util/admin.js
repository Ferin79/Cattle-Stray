const admin = require("firebase-admin");
var serviceAccount = require("../google-services.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cattle-stray.firebaseio.com",
  storageBucket: "cattle-stray.appspot.com",
});

module.exports = { admin };
