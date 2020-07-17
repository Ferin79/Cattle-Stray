import React, { useEffect, useState } from "react";
import { List, Button, TextInput, Avatar } from "react-native-paper";
import { SafeAreaView, View, FlatList, Dimensions, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import useTheme from "../hooks/useTheme";
import firebase from "../hooks/useFirebase";
import { handleAddComment } from "../actions/AddComment";

const { height, width } = Dimensions.get("window");

const ViewComments = ({ route }) => {
  const themeStyle = useTheme();

  const id = route.params.docId;

  const [comments, setComments] = useState([]);

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

  const [commentText, setCommentText] = useState("");
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          height: height * 0.8,
          backgroundColor: themeStyle.backgroundColor,
        }}
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
                    source={{ uri: firebase.auth().currentUser.photoURL }}
                    style={{ backgroundColor: "#000" }}
                  />
                )}
                titleStyle={{ color: themeStyle.textColor, fontSize: 18 }}
                descriptionStyle={{ color: themeStyle.textSecondaryColor }}
              />
            );
          }}
        />
      </View>
      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: themeStyle.backgroundColor }}
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
    </SafeAreaView>
  );
};

export default ViewComments;
