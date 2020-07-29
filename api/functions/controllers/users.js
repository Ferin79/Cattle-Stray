const firebase = require("firebase");

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

exports.getUsers = (req, res, next) => {
  firebase
    .firestore()
    .collection("users")
    .where("role", "==", "user")
    .get()
    .then((docs) => {
      const data = [];

      docs.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });

      res.status(200).json({
        success: true,
        data: {
          count: data.length,
          users: data,
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
