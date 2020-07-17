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
            role: "user",
            photoUrl:
              "https://firebasestorage.googleapis.com/v0/b/cattle-stray.appspot.com/o/dummyProfile%2Fperson.png?alt=media&token=a29add43-a17a-4d8b-a8be-71cb0d57c981",
            createdAt: firebase.firestore.Timestamp.now(),
          })
          .then(() => {
            firebase
              .auth()
              .currentUser.updateProfile({
                displayName: `${firstname} ${lastname}`,
                photoURL:
                  "https://firebasestorage.googleapis.com/v0/b/cattle-stray.appspot.com/o/dummyProfile%2Fperson.png?alt=media&token=a29add43-a17a-4d8b-a8be-71cb0d57c981",
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
