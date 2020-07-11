import firebase from "../hooks/useFirebase";

export const handleSignUp = (email, password, firstname, lastname) => {
  return new Promise((resolve, reject) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((data) => {
        console.log(data.user.uid);
        firebase
          .firestore()
          .doc(`/users/${data.user.uid}`)
          .set({
            firstname,
            lastname,
            email,
            createdAt: firebase.firestore.Timestamp.now(),
          })
          .then(() => {
            resolve(data);
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
