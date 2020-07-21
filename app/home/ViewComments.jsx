import React, { useEffect, useState } from "react";
import { List, Button, TextInput, Avatar } from "react-native-paper";
import { SafeAreaView, View, FlatList, Dimensions, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import useTheme from "../hooks/useTheme";
import firebase from "../hooks/useFirebase";
import { handleAddComment } from "../actions/AddComment";

const ViewComments = ({ route }) => {
  const themeStyle = useTheme();

  const id = route.params.docId;

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (id) {
      firebase
        .firestore()
        .doc(`/reports/${id}`)
        .onSnapshot((docs) => {
          setComments([...docs.data().comments]);
        });
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View
          style={{ flex: 0.9, backgroundColor: themeStyle.backgroundColor }}
        >
          <FlatList
            data={comments}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <List.Item
                  style={{
                    backgroundColor: themeStyle.secondaryColor,
                    borderBottomWidth: 1,
                    marginVertical: 10,
                  }}
                  title={item.message}
                  description={item.createdAt.toDate().toLocaleString()}
                  left={() => (
                    <Avatar.Image
                      size={50}
                      source={{ uri: item.photoUrl }}
                      style={{ backgroundColor: "#000" }}
                    />
                  )}
                  titleNumberOfLines={50}
                  descriptionNumberOfLines={50}
                  titleStyle={{ color: themeStyle.textColor, fontSize: 18 }}
                  descriptionStyle={{
                    color: themeStyle.textSecondaryColor,
                    fontSize: 12,
                    marginTop: 10,
                  }}
                />
              );
            }}
          />
        </View>
        <View style={{ flex: 0.1 }}>
          <KeyboardAwareScrollView
            style={{
              backgroundColor: themeStyle.backgroundColor,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <TextInput
                value={commentText}
                onChangeText={(event) => setCommentText(event)}
                multiline
                mode="outlined"
                label="type comment here ....."
                style={{
                  color: themeStyle.textColor,
                  backgroundColor: themeStyle.backgroundColor,
                  width: "60%",
                }}
                underlineColor={themeStyle.textColor}
                theme={{
                  colors: {
                    placeholder: themeStyle.textSecondaryColor,
                    text: themeStyle.textColor,
                  },
                }}
              />
              <Button
                onPress={() => {
                  if (commentText.trim() === "") {
                    Alert.alert("Enter text to Comment");
                    return;
                  }
                  handleAddComment(id, commentText)
                    .then(() => {
                      setCommentText("");
                    })
                    .catch((error) => console.log(error));
                }}
                color={themeStyle.primaryColor}
                mode="contained"
              >
                Comment
              </Button>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ViewComments;
