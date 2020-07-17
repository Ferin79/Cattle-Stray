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
          if (!isUpvoted) {
            upvotes.push(userId);
          }
        }

        if (type === "downvote") {
          if (!isDownVoted) {
            downvotes.push(userId);
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
