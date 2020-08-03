const firebase = require("firebase");
const config = require("../util/config");

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

exports.addSuperuser = (req, res, next) => {
  const { email, password, name, type } = req.body;

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((data) => {
      firebase
        .firestore()
        .doc(`/organizations/${data.user.uid}`)
        .set({
          uid: data.user.uid,
          email,
          password,
          name,
          role: "admin",
          type,
          createdAt: firebase.firestore.Timestamp.now(),
          notificationToken: "",
          photoUrl:
            "https://firebasestorage.googleapis.com/v0/b/cattle-stray.appspot.com/o/dummyProfile%2Fperson.png?alt=media&token=226129bb-3586-4d1d-852c-9a8e54ba248e",
        })
        .then(() => {
          res.status(201).json({
            success: true,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    });
};
