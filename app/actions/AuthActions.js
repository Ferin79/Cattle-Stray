import firebase from "../hooks/useFirebase";

export const handleSignUp = (email, password, firstname, lastname) => {
  return new Promise((resolve, reject) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((data) => {
        firebase
          .firestore()
          .doc(`/users/${data.user.uid}`)
          .set({
            firstname,
            lastname,
            email,
            uid: data.user.uid,
            role: "user",
            points: 0,
            photoUrl:
              "https://firebasestorage.googleapis.com/v0/b/cattle-stray.appspot.com/o/dummyProfile%2Fperson.png?alt=media&token=226129bb-3586-4d1d-852c-9a8e54ba248e",
            createdAt: firebase.firestore.Timestamp.now(),
          })
          .then(() => {
            firebase
              .auth()
              .currentUser.updateProfile({
                displayName: `${firstname} ${lastname}`,
                photoURL:
                  "https://firebasestorage.googleapis.com/v0/b/cattle-stray.appspot.com/o/dummyProfile%2Fperson.png?alt=media&token=226129bb-3586-4d1d-852c-9a8e54ba248e",
              })
              .then(() => {
                resolve(data);
              });
          });
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

export const handleSignIn = (email, password) => {
  return new Promise((resolve, reject) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => resolve(user))
      .catch((error) => reject(error.message));
  });
};
