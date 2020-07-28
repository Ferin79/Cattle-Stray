const firebase = require("firebase");
const { admin } = require("../util/admin");

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

exports.getOrganization = (req, res, next) => {
  firebase
    .firestore()
    .collection("organizations")
    .where("role", "==", "organization")
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

exports.addOrganization = (req, res, next) => {
  const { email, password, name, type, authUserId } = req.body;
  const role = "organization";

  if (email.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "Email field cannot be empty",
    });
  }
  if (password.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "Password field cannot be empty",
    });
  }
  if (name.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "Name field cannot be empty",
    });
  }
  if (type.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "Type field cannot be empty",
    });
  }

  firebase
    .firestore()
    .doc(`/users/${authUserId}`)
    .get()
    .then((doc) => {
      if (doc.data().role === "admin") {
        firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then((data) => {
            firebase
              .firestore()
              .doc(`/organizations/${data.user.uid}`)
              .set({
                createdAt: firebase.firestore.Timestamp.now(),
                email,
                name,
                photoUrl:
                  "https://firebasestorage.googleapis.com/v0/b/cattle-stray.appspot.com/o/dummyProfile%2Fperson.png?alt=media&token=226129bb-3586-4d1d-852c-9a8e54ba248e",
                points: 0,
                role,
                type,
                uid: data.user.uid,
              })
              .then(() => {
                res.status(202).json({
                  success: true,
                });
              });
          });
      } else {
        res.status(401).json({
          success: false,
          error: "You are not authorized",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    });
};

exports.deleteOrganization = (req, res, next) => {
  const { organizationId, authUserId } = req.body;

  firebase
    .firestore()
    .doc(`/users/${authUserId}`)
    .get()
    .then((doc) => {
      if (doc.data().role === "admin") {
        admin
          .auth()
          .deleteUser(organizationId)
          .then(() => {
            firebase
              .firestore()
              .doc(`/organizations/${organizationId}`)
              .delete();
            res.status(200).json({
              success: true,
            });
          });
      } else {
        res.status(400).json({
          success: false,
          error: "You are not authorized",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    });
};
