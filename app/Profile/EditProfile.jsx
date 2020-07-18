import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Dimensions,
  ImageBackground,
  Alert,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { TextInput, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import firebase from "../hooks/useFirebase";
import LoadingScreen from "../hooks/LoadingScreen";
import useTheme from "../hooks/useTheme";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const EditProfile = ({ navigation }) => {
  const themeStyle = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [firstname, setFirstname] = useState(
    firebase.auth().currentUser.displayName.split(" ")[0]
  );
  const [lastname, setLastname] = useState(
    firebase.auth().currentUser.displayName.split(" ")[1]
  );

  const pickImage = async () => {
    setIsLoading(true);

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const blobImage = await uriToBlob(result.uri);
      var storageRef = firebase.storage().ref();
      var uploadTask = storageRef
        .child(`/profiles/${firebase.auth().currentUser.uid}`)
        .put(blobImage);
      uploadTask.on(
        "state_changed",
        function (snapshot) {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              console.log("Upload is paused");
              break;
            case firebase.storage.TaskState.RUNNING:
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        function (error) {
          console.log(error);
          setIsLoading(false);
          Alert.alert(error.message);
        },
        function () {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then(function (downloadURL) {
              console.log("File available at", downloadURL);
              firebase
                .firestore()
                .doc(`/users/${firebase.auth().currentUser.uid}`)
                .update({
                  photoUrl: downloadURL,
                })
                .then(async () => {
                  firebase
                    .auth()
                    .currentUser.updateProfile({
                      photoURL: downloadURL,
                    })
                    .then(() => {
                      setIsLoading(false);
                    });
                })
                .catch((error) => {
                  Alert.alert(error.message);
                  setIsLoading(false);
                });
            })
            .catch((error) => {
              Alert.alert(error.message);
              setIsLoading(false);
              console.log(error);
            });
        }
      );
    } else {
      setIsLoading(false);
    }
  };

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

  const handleNameChange = () => {
    if (firstname.trim() === "") {
      Alert.alert("First Name cannot be empty");
    } else if (lastname.trim() === "") {
      Alert.alert("Last Name cannot be empty");
    } else {
      setIsLoading(true);
      firebase
        .firestore()
        .doc(`/users/${firebase.auth().currentUser.uid}`)
        .update({
          firstname,
          lastname,
        })
        .then(() => {
          firebase
            .auth()
            .currentUser.updateProfile({
              displayName: `${firstname} ${lastname}`,
            })
            .then(() => {
              setIsLoading(false);
            });
        })
        .catch((error) => {
          setIsLoading(false);
          console.log(error);
        });
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: themeStyle.backgroundColor }}
    >
      <ScrollView
        style={{
          flex: 1,
          height: SCREEN_HEIGHT,
          backgroundColor: themeStyle.backgroundColor,
        }}
      >
        <View
          style={{
            flex: 1,
            height: SCREEN_HEIGHT,
            backgroundColor: themeStyle.backgroundColor,
          }}
        >
          <ImageBackground
            source={{
              uri: firebase.auth().currentUser.photoURL,
            }}
            style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.4 }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                margin: 20,
              }}
            >
              <FontAwesome
                name="close"
                size={30}
                color="#0AF"
                onPress={() =>
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "ProfileStack" }],
                  })
                }
              />
              <MaterialIcons
                name="edit"
                size={30}
                color="#0AF"
                onPress={pickImage}
              />
            </View>
          </ImageBackground>
          <View
            style={{
              height: SCREEN_HEIGHT * 2,
              width: SCREEN_WIDTH * 0.9,
              backgroundColor: themeStyle.secondaryColor,
              position: "absolute",
              left: (SCREEN_WIDTH - SCREEN_WIDTH * 0.9) / 2,
              top: SCREEN_HEIGHT * 0.3,
            }}
          >
            <TextInput
              label="First Name"
              value={firstname}
              mode="flat"
              onChangeText={(text) => setFirstname(text)}
              style={{
                color: themeStyle.textColor,
                backgroundColor: themeStyle.secondaryColor,
                margin: 20,
              }}
              underlineColor={themeStyle.textColor}
              theme={{
                colors: {
                  placeholder: themeStyle.textSecondaryColor,
                  text: themeStyle.textColor,
                },
              }}
            />

            <TextInput
              label="Last Name"
              value={lastname}
              mode="flat"
              onChangeText={(text) => setLastname(text)}
              style={{
                color: themeStyle.textColor,
                backgroundColor: themeStyle.secondaryColor,
                margin: 20,
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
              style={{
                marginHorizontal: 50,
                marginVertical: 20,
                backgroundColor: "#0af",
                padding: 10,
              }}
              mode="contained"
              onPress={() => handleNameChange()}
            >
              Update
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
