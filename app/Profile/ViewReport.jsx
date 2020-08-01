import React, { useState, useEffect } from "react";
import {
  Avatar,
  Card,
  Paragraph,
  Subheading,
  Button,
  ActivityIndicator,
  Title,
} from "react-native-paper";
import ImageView from "react-native-image-viewing";
import firebase from "../hooks/useFirebase";
import { View, TouchableOpacity } from "react-native";

const ViewReport = ({ item, themeStyle, handleVote, navigation }) => {
  const LeftContent = () => (
    <Avatar.Image size={50} source={{ uri: item.photoUrl }} />
  );

  const RightContent = () => {
    if (item.isResolved) {
      return (
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <Avatar.Icon
            size={30}
            color="#fff"
            style={{ backgroundColor: "#0AF" }}
            icon="check-all"
          />
          <Paragraph
            style={{ fontSize: 12, color: themeStyle.textSecondaryColor }}
          >
            Resolved
          </Paragraph>
        </View>
      );
    } else if (item.isRejected) {
      return (
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <Avatar.Icon
            size={30}
            color="#fff"
            style={{ backgroundColor: "red" }}
            icon="account-remove"
          />
          <Paragraph
            style={{ fontSize: 12, color: themeStyle.textSecondaryColor }}
          >
            Rejected
          </Paragraph>
        </View>
      );
    } else if (item.isUnderProcess) {
      return (
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <Avatar.Icon
            size={30}
            color="#fff"
            style={{ backgroundColor: "green" }}
            icon="all-inclusive"
          />
          <Paragraph
            style={{ fontSize: 12, color: themeStyle.textSecondaryColor }}
          >
            Processing
          </Paragraph>
        </View>
      );
    } else {
      return (
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <Avatar.Icon
            size={30}
            color="#fff"
            style={{ backgroundColor: "gold" }}
            icon="check"
          />
          <Paragraph
            style={{ fontSize: 12, color: themeStyle.textSecondaryColor }}
          >
            Submiitted
          </Paragraph>
        </View>
      );
    }
  };

  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownVoted, setIsDownVoted] = useState(false);

  const [upvoteLoading, setUpvoteLoading] = useState(false);
  const [downvoteLoading, setDownvoteLoading] = useState(false);
  const [visible, setIsVisible] = useState(false);

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
        title={item.displayName}
        subtitle={item.reportType}
        left={() => <LeftContent />}
        titleStyle={{
          color: themeStyle.textColor,
          textTransform: "capitalize",
        }}
        right={() => <RightContent />}
        subtitleStyle={{
          color: themeStyle.textSecondaryColor,
          textTransform: "capitalize",
        }}
      />
      <Card.Content>
        <Title
          style={{ color: themeStyle.textColor, textTransform: "capitalize" }}
        >
          {item.animalType}
        </Title>
        <Paragraph
          style={{ color: themeStyle.textColor, textTransform: "capitalize" }}
        >
          Count: {item.animalCount}
        </Paragraph>
        <Paragraph style={{ color: themeStyle.textColor }}>
          GI: {item.animalGI}
        </Paragraph>
        <Subheading
          style={{ color: themeStyle.textColor, textTransform: "capitalize" }}
        >
          Condition: {item.animalCondition}
        </Subheading>

        <Paragraph style={{ color: themeStyle.textColor }}>
          Description: {item.description}
        </Paragraph>

        <Paragraph
          style={{ color: themeStyle.textSecondaryColor, fontSize: 12 }}
        >
          Last Seen: {new Date(item.createdAt.toDate()).toLocaleString()}
        </Paragraph>
      </Card.Content>

      <TouchableOpacity onPress={() => setIsVisible(true)}>
        <ImageView
          images={[
            {
              uri: item.animalImageUrl,
            },
          ]}
          imageIndex={0}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />
        <Card.Cover source={{ uri: item.animalImageUrl }} />
      </TouchableOpacity>
      <Card.Actions>
        {!(item.uid === firebase.auth().currentUser.uid) && (
          <>
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
          </>
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
        <Button
          onPress={() => {
            navigation.navigate("MapViewStack", {
              coords: JSON.stringify(item.animalMovingCoords),
            });
          }}
          color={themeStyle.textColor}
          icon="google-maps"
        ></Button>
      </Card.Actions>

      {(item.isRejected || item.isResolved) && (
        <View style={{ marginLeft: 20 }}>
          <Subheading style={{ color: themeStyle.textColor }}>
            Action Taken by:
            {item.actionDescription && item.actionDescription.name}
          </Subheading>
          <Paragraph style={{ color: themeStyle.textSecondaryColor }}>
            Description:
            {item.actionDescription && item.actionDescription.description}
          </Paragraph>
        </View>
      )}
      <Paragraph
        style={{
          fontSize: 12,
          color: themeStyle.textSecondaryColor,
          marginLeft: 20,
        }}
      >
        Report ID: {item.id}
      </Paragraph>
    </Card>
  );
};

export default ViewReport;
