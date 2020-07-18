import React, { useState, useEffect } from "react";
import {
  Avatar,
  Card,
  Paragraph,
  Subheading,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import firebase from "../hooks/useFirebase";

const ViewReport = ({ item, themeStyle, handleVote, navigation }) => {
  const LeftContent = (props) => (
    <Avatar.Icon {...props} icon="information-outline" />
  );

  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownVoted, setIsDownVoted] = useState(false);

  const [upvoteLoading, setUpvoteLoading] = useState(false);
  const [downvoteLoading, setDownvoteLoading] = useState(false);

  useEffect(() => {
    const upvotes = item.upvotes;
    const downvotes = item.downvotes;

    upvotes.forEach((item) => {
      if (item === firebase.auth().currentUser.uid) {
        setIsUpvoted(true);
      } else {
        setIsUpvoted(false);
      }
    });

    downvotes.forEach((item) => {
      if (item === firebase.auth().currentUser.uid) {
        setIsDownVoted(true);
      } else {
        setIsDownVoted(false);
      }
    });
  }, [item]);

  return (
    <Card
      style={{
        elevation: 5,
        marginVertical: 10,
        marginHorizontal: 20,
        backgroundColor: themeStyle.secondaryColor,
      }}
    >
      <Card.Title
        title={item.animalType}
        subtitle={`Count: ${item.animalCount}`}
        left={LeftContent}
        titleStyle={{
          color: themeStyle.textColor,
          textTransform: "capitalize",
        }}
        subtitleStyle={{
          color: themeStyle.textSecondaryColor,
          textTransform: "capitalize",
        }}
      />
      <Card.Content>
        <Subheading
          style={{ color: themeStyle.textColor, textTransform: "capitalize" }}
        >
          Condition: {item.animalCondition}
        </Subheading>
        <Paragraph style={{ color: themeStyle.textColor }}>
          Description: {item.description}
        </Paragraph>
      </Card.Content>

      <Card.Cover source={{ uri: item.animalImageUrl }} />
      <Card.Actions>
        {upvoteLoading ? (
          <ActivityIndicator size="small" />
        ) : (
          <Button
            onPress={() => {
              setUpvoteLoading(true);
              handleVote(
                item.id,
                firebase.auth().currentUser.uid,
                "upvote"
              ).finally(() => setUpvoteLoading(false));
            }}
            color={isUpvoted ? "#0AF" : themeStyle.textColor}
            icon="arrow-up-bold"
          >
            {item.upvotes.length}
          </Button>
        )}
        {downvoteLoading ? (
          <ActivityIndicator size="small" />
        ) : (
          <Button
            onPress={() => {
              setDownvoteLoading(true);
              handleVote(
                item.id,
                firebase.auth().currentUser.uid,
                "downvote"
              ).finally(() => setDownvoteLoading(false));
            }}
            color={isDownVoted ? "red" : themeStyle.textColor}
            icon="arrow-down-bold"
          >
            {item.downvotes.length}
          </Button>
        )}
        <Button
          onPress={() => {
            navigation.navigate("CommentStack", { docId: item.id });
          }}
          color={themeStyle.textColor}
          icon="comment"
        >
          {item.comments.length}
        </Button>
      </Card.Actions>
    </Card>
  );
};

export default ViewReport;
