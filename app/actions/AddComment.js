import firebase from "../hooks/useFirebase";

export const handleAddComment = (id, text) => {
  return new Promise((resolve, reject) => {
    firebase
      .firestore()
      .doc(`/reports/${id}`)
      .get()
      .then((doc) => {
        const comments = doc.data().comments;
        comments.push({
          userId: firebase.auth().currentUser.uid,
          message: text,
          createdAt: firebase.firestore.Timestamp.now(),
          photoUrl: firebase.auth().currentUser.photoURL,
        });
        firebase
          .firestore()
          .doc(`/reports/${id}`)
          .update({
            comments: comments,
          })
          .then(() => resolve());
      })
      .catch((error) => reject(error.message));
  });
};
