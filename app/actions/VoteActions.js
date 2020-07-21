import firebase from "../hooks/useFirebase";

export const handleVote = (id, userId, type) => {
  return new Promise((resolve, reject) => {
    firebase
      .firestore()
      .doc(`/reports/${id}`)
      .get()
      .then((doc) => {
        let upvotes = doc.data().upvotes;
        let downvotes = doc.data().downvotes;

        let isUpvoted = false;
        let isDownVoted = false;

        upvotes.forEach((item) => {
          if (item === userId) {
            isUpvoted = true;
          }
        });

        downvotes.forEach((item) => {
          if (item === userId) {
            isDownVoted = true;
          }
        });

        if (isDownVoted) {
          downvotes = downvotes.filter((item) => item !== userId);
        }
        if (isUpvoted) {
          upvotes = upvotes.filter((item) => item !== userId);
        }

        if (type === "upvote") {
          console.log("Called upvoted");
          if (!isUpvoted) {
            console.log("Adding Upvote and adding 5");
            upvotes.push(userId);
            firebase
              .firestore()
              .doc(`/users/${doc.data().uid}`)
              .update({
                points: firebase.firestore.FieldValue.increment(5),
              });
          } else {
            console.log("Removing 5");
            firebase
              .firestore()
              .doc(`/users/${doc.data().uid}`)
              .update({
                points: firebase.firestore.FieldValue.increment(-5),
              });
          }
        }

        if (type === "downvote") {
          if (!isDownVoted) {
            downvotes.push(userId);
            firebase
              .firestore()
              .doc(`/users/${doc.data().uid}`)
              .update({
                points: firebase.firestore.FieldValue.increment(-5),
              });
          } else {
            firebase
              .firestore()
              .doc(`/users/${doc.data().uid}`)
              .update({
                points: firebase.firestore.FieldValue.increment(5),
              });
          }
        }

        firebase
          .firestore()
          .doc(`/reports/${id}`)
          .update({
            upvotes: upvotes,
            downvotes: downvotes,
          })
          .then(() => {
            resolve({ success: true });
          });
      })
      .catch((error) => reject({ success: false, error: error.message }));
  });
};
