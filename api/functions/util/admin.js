const admin = require("firebase-admin");
var serviceAccount = require("../google-services.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cattle-stray.firebaseio.com",
  storageBucket: "cattle-stray.appspot.com",
  messagingSenderId: "1080865857229",
});

module.exports = { admin };
