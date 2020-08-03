import React, { useState, useEffect, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Dimensions,
  ImageBackground,
  Image,
  Alert,
} from "react-native";
import { Camera } from "expo-camera";
import { Entypo, Ionicons, FontAwesome } from "@expo/vector-icons";
import { Surface, Button, TextInput } from "react-native-paper";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { Picker } from "@react-native-community/picker";
import * as geofirestore from "geofirestore";
import firebase from "../hooks/useFirebase";
import useTheme from "../hooks/useTheme";
import useMapTheme from "../hooks/useMapTheme";
import RenderMarker from "../home/RenderMarker";
import { GlobalContext } from "../state/RootReducer";

const { width, height } = Dimensions.get("window");

let calTime;
let cameraRef;

const PickImage = ({ navigation }) => {
  const themeStyle = useTheme();
  const mapTheme = useMapTheme();

  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isCameraUiOn, setIsCameraUiOn] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [flashMode, setFlashMode] = useState(true);
  const [capturePhoto, setCapturePhoto] = useState(null);
  const [imagePreview, setImagePreview] = useState(false);
  const [ImageDetectionProcessing, setImageDetectionProcessing] = useState(
    false
  );
  const [imageDetectionFailed, setImageDetectionFailed] = useState(false);
  const [TimerCount, setTimerCount] = useState(0);
  const [isOutput, setIsOutput] = useState(false);
  const [isMarker, setIsMarker] = useState(true);
  const [animalType, setAnimalType] = useState("");
  const [reportType, setReportType] = useState("general");
  const [animalCount, setAnimalCount] = useState(0);
  const [animalCondition, setanimalCondition] = useState("normal");
  const [description, setDescription] = useState("");
  const [GINumber, setGINumber] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const { ReportState, ReportDispatch } = useContext(GlobalContext);

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

  const sendImageForDetection = async () => {
    setImageDetectionProcessing(true);
    setImageDetectionFailed(false);
    setTimerCount(0);
    calculateTimeElapsed();

    const blob = await uriToBlob(capturePhoto);

    var storageRef = firebase.storage().ref();
    var uploadTask = storageRef
      .child(`reports/${firebase.auth().currentUser.uid}`)
      .put(blob);
    uploadTask.on(
      "state_changed",
      function (snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
        Alert.alert(error.message);
      },
      function () {
        uploadTask.snapshot.ref
          .getDownloadURL()
          .then(async function (downloadURL) {
            console.log("File available at", downloadURL);
            setImageUrl(downloadURL);

            const response = await fetch(
              "https://us-central1-cattle-stray.cloudfunctions.net/api/detect/",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  accept: "application/json",
                },
                body: JSON.stringify({
                  imageUrl: downloadURL,
                }),
              }
            );

            const responseData = await response.json();
            console.log(responseData);
            if (responseData.success) {
              setIsOutput(true);
              detectInfo(responseData.labels);
              const count = countNumber(responseData.obj);
              setAnimalCount(count);
              setGINumber(responseData.texts[0]);
            } else {
              Alert.alert(responseData.error);
            }
          })
          .catch((error) => {
            Alert.alert(error.message);
            console.log(error);
          })
          .finally(() => {
            setImageDetectionProcessing(false);
            clearInterval(calTime);
          });
      }
    );
  };

  const calculateTimeElapsed = () => {
    calTime = setInterval(() => {
      setTimerCount((count) => count + 1);
    }, 1000);
  };

  const snap = async () => {
    if (cameraRef) {
      let photo = await cameraRef.takePictureAsync({
        quality: 0.5,
      });
      setCapturePhoto(photo.uri);
      setIsCapturing(false);
      setImagePreview(true);
      setIsCameraUiOn(false);
      setIsOutput(false);
    }
  };

  const handleOnTapMap = (event) => {
    ReportDispatch({
      type: "SET_COORDINATE",
      payload: {
        latitude: event.nativeEvent.coordinate.latitude,
        longitude: event.nativeEvent.coordinate.longitude,
      },
    });
    setIsMarker(true);
  };

  const detectInfo = (inputArr) => {
    console.log(inputArr);
    var full_array = [
      [
        "cow-goat family",
        "calf",
        "zebu",
        "dairy cow",
        "ox",
        "bull",
        "Working animal",
        "Snout",
      ],
      ["goat", "goats", "goat-antelope", "feral goat"],
      ["water buffalo", "cow-goat family"],
    ];
    var transport = [
      "mode of transportation",
      "road",
      "vehicle",
      "mode of transport",
    ];
    var trans = 0;
    var arr = [0, 0, 0];
    var input = inputArr;

    var estimation = ["cow", "goat", "buffalo"];
    for (var i = 0; i <= 5; i++) {
      for (var j in full_array[i]) {
        for (var k in input) {
          if (input[k].toUpperCase() == full_array[i][j].toUpperCase()) {
            arr[i]++;
            break;
          }
        }
      }
    }
    for (var i in input) {
      for (var j in transport) {
        if (input[i] == transport[j]) {
          trans++;
        }
      }
    }
    var max = 0;
    for (var i in arr) {
      if (arr[i] > arr[max]) {
        max = i;
      }
    }
    if (arr[max] == 0) {
      console.log("Please insert image with cattles");
      setImageDetectionFailed(true);
    } else {
      console.log(estimation[max]);
      setAnimalType(estimation[max]);
      for (var i in arr) {
        if (arr[i] == arr[max] && i != max) {
          console.log(estimation[i]);
          setAnimalType(estimation[i]);
        }
      }
      if (trans >= 1) {
        setReportType("general");
      } else {
        setReportType("health");
      }
    }
  };

  function countNumber(Arr) {
    console.log(Arr);
    var Words = [
      "cow",
      "water buffalo",
      "goat",
      "animal",
      "cattle",
      "antelope",
    ];
    var animcount = 0;
    for (var i in Arr) {
      for (var j in Words) {
        if (Arr[i]["label"].toUpperCase() == Words[j].toUpperCase()) {
          animcount++;
        }
      }
    }
    return animcount;
  }

  const handleSubmitReport = () => {
    var firebaseRef = firebase.firestore();
    const GeoFirestore = geofirestore.initializeApp(firebaseRef);
    const geocollection = GeoFirestore.collection("reports");
    geocollection
      .add({
        reportType: reportType,
        animalGI: GINumber,
        animalType: animalType,
        animalCondition: animalCondition,
        animalCount: animalCount,
        animalIsMoving: "",
        animalImageUrl: imageUrl,
        animalMovingCoords: new firebase.firestore.GeoPoint(
          ReportState.userCoords.latitude,
          ReportState.userCoords.longitude
        ),
        coordinates: new firebase.firestore.GeoPoint(
          ReportState.userCoords.latitude,
          ReportState.userCoords.longitude
        ),
        userCoords: new firebase.firestore.GeoPoint(
          ReportState.userCoords.latitude,
          ReportState.userCoords.longitude
        ),
        description: description,
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
        navigation.reset({
          index: 0,
          routes: [{ name: "ReportSubmitted" }],
        });
      })
      .catch((error) => {
        Alert.alert("Oops", "Something went wrong, Try again...");
        console.log(error);
      });
  };

  const getCameraPermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  useEffect(() => {
    getCameraPermission();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (ImageDetectionProcessing) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Image
            source={require("../images/process.gif")}
            style={{ height: height * 0.5, width: width }}
          />
          <Text style={{ fontSize: 20 }}>{TimerCount} Second Elapsed</Text>
        </View>
      </SafeAreaView>
    );
  } else if (isCameraUiOn) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Camera
            style={{ flex: 1 }}
            type={type}
            ref={(ref) => (cameraRef = ref)}
            flashMode={
              flashMode
                ? Camera.Constants.FlashMode.on
                : Camera.Constants.FlashMode.off
            }
          >
            <Entypo
              name="cross"
              color="#FFF"
              size={50}
              onPress={() => setIsCameraUiOn(false)}
            />
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "flex-end",
                flexDirection: "row",
                zIndex: 9999,
              }}
            >
              <Ionicons
                name="md-reverse-camera"
                color="#FFF"
                size={35}
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              />
              {isCapturing ? (
                <FontAwesome name="circle" color="#FFF" size={60} />
              ) : (
                <FontAwesome
                  name="circle-o"
                  color="#FFF"
                  size={60}
                  onPress={() => {
                    setIsCapturing(true);
                    snap();
                  }}
                />
              )}
              <Ionicons
                name="ios-flash"
                color={flashMode ? "gold" : "#FFF"}
                size={35}
                onPress={() => setFlashMode(!flashMode)}
              />
            </View>
          </Camera>
        </View>
      </SafeAreaView>
    );
  } else if (imagePreview) {
    return (
      <SafeAreaView>
        <ImageBackground
          source={{ uri: capturePhoto }}
          style={{ height: height, width: width, resizeMode: "contain" }}
        >
          <View
            style={{
              display: "flex",
              flex: 0.95,
              justifyContent: "space-evenly",
              alignItems: "flex-end",
              flexDirection: "row",
              zIndex: 9999,
            }}
          >
            <Button
              style={{ width: width * 0.45, backgroundColor: "grey" }}
              icon="camera-retake"
              mode="contained"
              onPress={() => {
                setCapturePhoto(null);
                setIsCameraUiOn(true);
                setImagePreview(false);
              }}
            >
              Retake
            </Button>
            <Button
              style={{ width: width * 0.45, backgroundColor: "#0AF" }}
              icon="cloud-upload"
              mode="contained"
              onPress={() => {
                setIsCameraUiOn(false);
                setImagePreview(false);
                sendImageForDetection();
              }}
            >
              Process Image
            </Button>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: themeStyle.backgroundColor }}
      >
        <ScrollView style={{ flex: 1 }}>
          <View
            style={{
              paddingHorizontal: 25,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="ios-arrow-round-back"
              size={50}
              color={themeStyle.textColor}
              onPress={() => navigation.goBack()}
            />
            <Ionicons
              name="ios-menu"
              size={30}
              color={themeStyle.textColor}
              onPress={() => navigation.toggleDrawer()}
            />
          </View>
          <View style={{ margin: 20 }}>
            <Text
              style={{
                fontSize: 25,
                fontWeight: "600",
                color: themeStyle.textColor,
              }}
            >
              Report Cattles with Ease !!
            </Text>

            <Text
              style={{
                marginVertical: 10,
                color: themeStyle.textSecondaryColor,
              }}
            >
              Our System uses, cloud based fancy image detection algorithm to
              process your image.
            </Text>
          </View>

          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              style={{
                width: width * 0.5,
                backgroundColor: themeStyle.primaryColor,
              }}
              icon="camera"
              mode="contained"
              onPress={() => setIsCameraUiOn(true)}
            >
              Take Image
            </Button>
          </View>

          {TimerCount !== 0 && (
            <Text
              style={{
                margin: 20,
                color: themeStyle.textSecondaryColor,
              }}
            >
              It takes {TimerCount} seconds to upload and detect the image. Here
              is detected output. Please update the output, if something is not
              detected correclty.
            </Text>
          )}

          {isOutput && (
            <>
              {imageDetectionFailed && (
                <>
                  <Text style={{ fontSize: 18, color: "red", margin: 20 }}>
                    Image detection algorithm was not able to detect. Please
                    enter details manually.
                  </Text>
                  <Button
                    onPress={() => navigation.navigate("PickReportType")}
                    mode="contained"
                    style={{
                      marginHorizontal: 25,
                      backgroundColor: themeStyle.primaryColor,
                    }}
                  >
                    Enter Manually
                  </Button>
                </>
              )}
              <Surface
                style={{
                  marginTop: 30,
                  marginHorizontal: 15,
                  backgroundColor: themeStyle.secondaryColor,
                }}
              >
                <TextInput
                  label="Animal Type"
                  value={animalType}
                  onChangeText={(event) => setAnimalType(event)}
                  style={{
                    width: "80%",
                    margin: 20,
                    color: themeStyle.textColor,
                    backgroundColor: themeStyle.backgroundColor,
                  }}
                  underlineColor={themeStyle.textColor}
                  theme={{
                    colors: {
                      placeholder: themeStyle.textSecondaryColor,
                      text: themeStyle.textColor,
                    },
                  }}
                />
              </Surface>

              <Surface
                style={{
                  marginTop: 30,
                  marginHorizontal: 15,
                  backgroundColor: themeStyle.secondaryColor,
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text style={{ color: themeStyle.textColor }}>Report Type</Text>
                <Picker
                  selectedValue={reportType}
                  style={{ height: 175, width: 100 }}
                  onValueChange={(itemValue) => {
                    console.log(itemValue);
                    setReportType(itemValue);
                  }}
                >
                  <Picker.Item label="Health" value="health" />
                  <Picker.Item label="General" value="general" />
                </Picker>
              </Surface>

              <Surface
                style={{
                  marginTop: 30,
                  marginHorizontal: 15,
                  backgroundColor: themeStyle.secondaryColor,
                }}
              >
                <TextInput
                  label="Animal Count"
                  value={animalCount.toString()}
                  keyboardType="number-pad"
                  onChangeText={(event) => setAnimalCount(event)}
                  style={{
                    width: "80%",
                    margin: 20,
                    color: themeStyle.textColor,
                    backgroundColor: themeStyle.backgroundColor,
                  }}
                  underlineColor={themeStyle.textColor}
                  theme={{
                    colors: {
                      placeholder: themeStyle.textSecondaryColor,
                      text: themeStyle.textColor,
                    },
                  }}
                />
              </Surface>

              <Surface
                style={{
                  marginTop: 30,
                  marginHorizontal: 15,
                  backgroundColor: themeStyle.secondaryColor,
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text style={{ color: themeStyle.textColor }}>
                  Animal Condition
                </Text>
                <Picker
                  selectedValue={animalCondition}
                  style={{ height: 200, width: 100 }}
                  onValueChange={(itemValue) => {
                    console.log(itemValue);
                    setanimalCondition(itemValue);
                  }}
                >
                  <Picker.Item label="Normal" value="normal" />
                  <Picker.Item label="Injuried" value="injuried" />
                  <Picker.Item label="Death" value="death" />
                </Picker>
              </Surface>

              <Surface
                style={{
                  marginTop: 30,
                  marginHorizontal: 15,
                  backgroundColor: themeStyle.secondaryColor,
                }}
              >
                <TextInput
                  label="Animal GI"
                  value={GINumber}
                  onChangeText={(event) => setGINumber(event)}
                  style={{
                    width: "80%",
                    margin: 20,
                    color: themeStyle.textColor,
                    backgroundColor: themeStyle.backgroundColor,
                  }}
                  underlineColor={themeStyle.textColor}
                  theme={{
                    colors: {
                      placeholder: themeStyle.textSecondaryColor,
                      text: themeStyle.textColor,
                    },
                  }}
                />
              </Surface>

              <Surface
                style={{
                  marginTop: 30,
                  marginHorizontal: 15,
                  backgroundColor: themeStyle.secondaryColor,
                }}
              >
                <TextInput
                  label="Description"
                  value={description}
                  onChangeText={(event) => setDescription(event)}
                  multiline
                  numberOfLines={10}
                  style={{
                    width: "80%",
                    margin: 20,
                    color: themeStyle.textColor,
                    backgroundColor: themeStyle.backgroundColor,
                  }}
                  underlineColor={themeStyle.textColor}
                  theme={{
                    colors: {
                      placeholder: themeStyle.textSecondaryColor,
                      text: themeStyle.textColor,
                    },
                  }}
                />
              </Surface>

              <Text
                style={{
                  margin: 20,
                  fontSize: 20,
                  color: themeStyle.textSecondaryColor,
                }}
              >
                Animal Location
              </Text>
              <MapView
                provider={PROVIDER_GOOGLE}
                customMapStyle={mapTheme}
                loadingEnabled
                showsBuildings
                showsCompass
                showsUserLocation
                showsScale
                shouldRasterizeIOS
                showsTraffic
                onPress={(event) => handleOnTapMap(event)}
                style={{
                  width: width,
                  height: height * 0.5,
                }}
                initialRegion={{
                  latitude: ReportState.userCoords.latitude,
                  longitude: ReportState.userCoords.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
              >
                {isMarker ? (
                  <RenderMarker
                    lat={ReportState.animalMovingCoords.latitude}
                    long={ReportState.animalMovingCoords.longitude}
                  />
                ) : null}
              </MapView>

              <View
                style={{
                  width: width,
                  marginVertical: 50,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  style={{ width: width * 0.5, backgroundColor: "#0AF" }}
                  icon="send-circle"
                  mode="contained"
                  onPress={() => handleSubmitReport()}
                >
                  Submit Report
                </Button>
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
};

export default PickImage;
