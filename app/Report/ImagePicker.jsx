import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  ImageBackground,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  ScrollView,
} from "react-native";
import RNTextDetector from "react-native-text-detector";
import { Surface, TextInput as PaperTextInput } from "react-native-paper";
import { Camera } from "expo-camera";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { GlobalContext } from "../state/RootReducer";
import useTheme from "../hooks/useTheme";
import firebase from "../hooks/useFirebase";
import * as Progress from "react-native-progress";
import * as geofirestore from "geofirestore";

const ImagePicker = ({ navigation }) => {
  var firebaseRef = firebase.firestore();
  const GeoFirestore = geofirestore.initializeApp(firebaseRef);
  const geocollection = GeoFirestore.collection("reports");

  const themeStyle = useTheme();

  const { ReportState } = useContext(GlobalContext);

  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [openCamera, setOpenCamera] = useState(false);
  const [isPhotoSelected, setIsPhotoSelected] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(true);
  const [previewImage, setPreviewImage] = useState(false);
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [GIError, setGIError] = useState(false);
  const [GINumber, setGINumber] = useState("");

  var camera = null;

  const getCameraPermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasPermission(status === "granted");
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

  const handlevalidation = () => {
    if (GINumber.trim() === "") {
      Alert.alert(
        "Confirm",
        "Are you sure? you want to submit without entering GI number ?",
        [
          {
            text: "Edit",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Yes, Sure",
            onPress: () => {
              handleFinalSubmit();
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    const fileBlob = await uriToBlob(image);
    var storageRef = firebase.storage().ref(`reports/${Date.now()}`);
    var uploadTask = storageRef.put(fileBlob);
    uploadTask.on(
      "state_changed",
      function (snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setPercentage(Math.round(parseInt(progress)));
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
      },
      function () {
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log("File available at", downloadURL);

          geocollection
            .add({
              reportType: ReportState.reportType,
              animalGI: GINumber,
              animalType: ReportState.animalType,
              animalCondition: ReportState.animalCondition,
              animalCount: ReportState.animalCount,
              animalIsMoving: ReportState.animalIsMoving,
              animalImageUrl: downloadURL,
              animalMovingCoords: new firebase.firestore.GeoPoint(
                ReportState.animalMovingCoords.latitude,
                ReportState.animalMovingCoords.longitude
              ),
              coordinates: new firebase.firestore.GeoPoint(
                ReportState.animalMovingCoords.latitude,
                ReportState.animalMovingCoords.longitude
              ),
              userCoords: new firebase.firestore.GeoPoint(
                ReportState.userCoords.latitude,
                ReportState.userCoords.longitude
              ),
              description: desc,
              upvotes: [],
              downvotes: [],
              comments: [],
              isUnderProcess: false,
              isResolved: false,
              isRejected: false,
              uid: firebase.auth().currentUser.uid,
              email: firebase.auth().currentUser.email,
              createdAt: firebase.firestore.Timestamp.now(),
            })
            .then(() => {
              setIsLoading(false);
              navigation.reset({
                index: 0,
                routes: [{ name: "ReportSubmitted" }],
              });
            })
            .catch((error) => {
              setIsLoading(false);
              Alert.alert("Oops", "Something went wrong, Try again...");
              console.log(error);
            });
        });
      }
    );
  };

  useEffect(() => {
    getCameraPermission();
  }, []);

  const snap = async () => {
    setGIError(false);
    if (camera) {
      let photo = await camera.takePictureAsync();
      setImage(photo.uri);
      setPreviewImage(true);
      setOpenCamera(false);
      const uri = photo.uri;
      try {
        const options = {
          quality: 0.8,
          base64: true,
          skipProcessing: true,
        };
        const visionResp = await RNTextDetector.detectFromUri(uri);
        console.log("visionResp", visionResp);
      } catch (e) {
        setGIError(true);
        console.log(e.message);
      }
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: themeStyle.backgroundColor,
        }}
      >
        <Progress.Bar progress={percentage / 100} width={200} animated />
        <Text
          style={{ fontSize: 20, marginTop: 25, color: themeStyle.textColor }}
        >
          Uploading Report, Please Wait
        </Text>
      </SafeAreaView>
    );
  } else if (hasPermission === false) {
    return (
      <View
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: themeStyle.backgroundColor,
        }}
      >
        <Text style={{ color: themeStyle.textColor }}>
          Camera Permission Not Granted
        </Text>
        <Button
          mode="contained"
          style={{ backgroundColor: themeStyle.primaryColor }}
          onPress={getCameraPermission}
        >
          Allow Access
        </Button>
      </View>
    );
  } else if (openCamera) {
    return (
      <View style={{ flex: 1, backgroundColor: themeStyle.backgroundColor }}>
        <Camera
          flashMode={
            isFlashOn
              ? Camera.Constants.FlashMode.on
              : Camera.Constants.FlashMode.off
          }
          ref={(ref) => {
            camera = ref;
          }}
          style={{ height: Dimensions.get("window").height }}
          type={type}
        >
          <Ionicons
            name="ios-close"
            size={50}
            style={{
              zIndex: 9999,
              margin: 15,
            }}
            color="#FFF"
            onPress={() => {
              console.log("pressed");
              setOpenCamera(false);
            }}
          />
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "flex-end",
              }}
            >
              <Ionicons
                name="ios-reverse-camera"
                size={50}
                color="white"
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              />
              <Ionicons
                name="ios-camera"
                size={70}
                color="white"
                onPress={snap}
              />
              {!isFlashOn ? (
                <Ionicons
                  name="ios-flash-off"
                  size={50}
                  color="white"
                  onPress={() => {
                    setIsFlashOn(true);
                  }}
                />
              ) : (
                <Ionicons
                  name="ios-flash"
                  size={50}
                  color="yellow"
                  onPress={() => {
                    setIsFlashOn(false);
                  }}
                />
              )}
            </View>
          </View>
        </Camera>
      </View>
    );
  } else if (previewImage) {
    if (image) {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView>
            <ImageBackground
              source={{ uri: image }}
              style={{
                height: Dimensions.get("window").height,
                width: Dimensions.get("window").width,
                resizeMode: "cover",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  bottom: Dimensions.get("window").height * 0.05,
                  left: 0,
                  right: 0,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "flex-end",
                  backgroundColor: "#fff",
                }}
              >
                <MaterialIcons
                  name="restore"
                  size={50}
                  color="red"
                  onPress={() => {
                    setImage(null);
                    setOpenCamera(true);
                  }}
                />
                <MaterialIcons
                  name="check"
                  size={50}
                  color="green"
                  onPress={() => {
                    setOpenCamera(false);
                    setIsPhotoSelected(true);
                    setPreviewImage(false);
                  }}
                />
              </View>
            </ImageBackground>
          </ScrollView>
        </SafeAreaView>
      );
    } else {
      setOpenCamera(true);
    }
  } else {
    return (
      <KeyboardAwareScrollView>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: themeStyle.backgroundColor }}
        >
          <ScrollView
            style={{ flex: 1, backgroundColor: themeStyle.backgroundColor }}
          >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View>
                <View style={{ marginTop: 20, marginLeft: 20 }}>
                  <Text
                    style={{
                      fontSize: 25,
                      fontWeight: "500",
                      color: themeStyle.textColor,
                    }}
                  >
                    One Last Step
                  </Text>
                </View>
                <View>
                  <Button
                    mode="contained"
                    style={{
                      backgroundColor: themeStyle.primaryColor,
                      margin: 20,
                    }}
                    onPress={() => setOpenCamera(true)}
                  >
                    Take Photo | Open Camera
                  </Button>
                  <Text
                    style={{
                      color: themeStyle.textSecondaryColor,
                      marginHorizontal: 20,
                      marginBottom: 10,
                      fontSize: 12,
                    }}
                  >
                    Take Photo in such a way that GI tags on animal is clearly
                    visible.
                  </Text>
                  {isPhotoSelected ? (
                    <View>
                      <Text
                        style={{
                          color: "green",
                          marginLeft: 20,
                        }}
                      >
                        1 Photo Selected
                      </Text>
                    </View>
                  ) : (
                    <View>
                      <Text
                        style={{
                          color: "red",
                          marginLeft: 20,
                        }}
                      >
                        No Photo Selected
                      </Text>
                    </View>
                  )}
                </View>

                <View>
                  <Surface
                    style={{
                      backgroundColor: themeStyle.secondaryColor,
                      elevation: 5,
                      marginTop: 20,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        marginHorizontal: 20,
                        color: themeStyle.textSecondaryColor,
                      }}
                    >
                      GI number will be automatically detected from image, if it
                      is incorrect then edit GI number below.
                    </Text>
                    <PaperTextInput
                      keyboardType="default"
                      keyboardAppearance="dark"
                      mode="outlined"
                      label="GI Number"
                      value={GINumber}
                      placeholder="Example: GOA-12345"
                      onChangeText={(event) => setGINumber(event)}
                      style={{
                        margin: 20,
                        backgroundColor: themeStyle.backgroundColor,
                      }}
                      theme={{
                        colors: {
                          placeholder: themeStyle.textColor,
                          text: themeStyle.textColor,
                        },
                      }}
                    />
                    {GIError && (
                      <Text
                        style={{
                          fontSize: 12,
                          color: "red",
                          marginHorizontal: 20,
                          marginBottom: 5,
                        }}
                      >
                        * GI number recognization failed. Please enter GI number
                        manually.
                      </Text>
                    )}
                  </Surface>
                </View>

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
                      style={{
                        height: 150,
                        justifyContent: "flex-start",
                        color: themeStyle.textColor,
                      }}
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
              </View>
            </TouchableWithoutFeedback>
            <View>
              {isPhotoSelected ? (
                <Button
                  mode="contained"
                  style={{
                    margin: 20,
                    backgroundColor: themeStyle.primaryColor,
                  }}
                  onPress={() => handlevalidation()}
                >
                  Finish
                </Button>
              ) : (
                <Button
                  mode="contained"
                  style={{
                    margin: 20,
                    backgroundColor: themeStyle.primaryColor,
                  }}
                  onPress={() =>
                    Alert.alert("Error", "Please Take a Photo Of Animal")
                  }
                >
                  Finish
                </Button>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    );
  }
};

export default ImagePicker;
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
