import React, { useState, useContext } from "react";
import { SafeAreaView, View, Text, TextInput, StyleSheet } from "react-native";
import useTheme from "../hooks/useTheme";
import { GlobalContext } from "../state/RootReducer";
import * as geofirestore from "geofirestore";
import firebase from "../hooks/useFirebase";

const DescriptionAddReport = ({ navigation, route }) => {
  console.log(route);
  const themeStyle = useTheme();

  const { ReportState } = useContext(GlobalContext);

  const [desc, setDesc] = useState("");

  var firebaseRef = firebase.firestore();
  const GeoFirestore = geofirestore.initializeApp(firebaseRef);
  const geocollection = GeoFirestore.collection("reports");

  const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };

      xhr.onerror = function () {
        reject(new Error("uriToBlob failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);

      xhr.send(null);
    });
  };

  const handleSubmit = () => {};

  return (
    <SafeAreaView>
      <View style={{ padding: 25 }}>
        <Text
          style={{
            fontSize: 25,
            color: themeStyle.textSecondaryColor,
          }}
        >
          Some Suggestion / Feedback / Description
        </Text>
        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.textArea}
            underlineColorAndroid="transparent"
            placeholder="Type something (optional)"
            placeholderTextColor={themeStyle.textColor}
            numberOfLines={10}
            multiline={true}
            value={desc}
            onChangeText={(event) => setDesc(event)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DescriptionAddReport;

const styles = StyleSheet.create({
  textAreaContainer: {
    marginTop: 30,
    borderColor: "grey",
    borderWidth: 1,
    padding: 5,
    borderRadius: 20,
  },
  textArea: {
    height: 150,
    justifyContent: "flex-start",
  },
});
