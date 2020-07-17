import _ from "lodash";
import Constants from "expo-constants";
import React, { useEffect, useContext, useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Dimensions,
  Text,
  YellowBox,
  Image,
} from "react-native";
import { Searchbar, FAB, Card, Button } from "react-native-paper";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import BottomSheet from "react-native-bottomsheet-reanimated";
import * as geofirestore from "geofirestore";
import Lightbox from "react-native-lightbox";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { GlobalContext } from "../state/RootReducer";
import useTheme from "../hooks/useTheme";
import useMapTheme from "../hooks/useMapTheme";
import LoadingScreen from "../hooks/LoadingScreen";
import firebase from "../hooks/useFirebase";
import RenderMarker from "./RenderMarker";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
let token = "";

const Home = ({ navigation, navigator }) => {
  YellowBox.ignoreWarnings(["Setting a timer"]);
  const _console = _.clone(console);
  console.warn = (message) => {
    if (message.indexOf("Setting a timer") <= -1) {
      _console.warn(message);
    }
  };

  const themeStyle = useTheme();
  const mapTheme = useMapTheme();

  const { ReportDispatch } = useContext(GlobalContext);

  const [latitute, setLatitute] = useState(0);
  const [longitute, setLongitute] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState([]);
  const [radiusInKM, setRadiusInKM] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const circleRef = useRef();
  let mapRef = useRef();

  const onChangeSearch = (query) => {
    if (query.trim() === "") {
      setSelectedAnimal(null);
    }
    setSearchQuery(query);
  };

  const fetchReports = (location) => {
    var firebaseRef = firebase.firestore();
    const GeoFirestore = geofirestore.initializeApp(firebaseRef);
    const geocollection = GeoFirestore.collection("reports");

    // Create a GeoQuery based on a location
    const query = geocollection.near({
      center: new firebase.firestore.GeoPoint(
        location.coords.latitude,
        location.coords.longitude
      ),
      radius: radiusInKM,
    });

    // Get query (as Promise)
    query.onSnapshot((value) => {
      const data = [];
      value.docs.forEach((doc) => {
        if (!doc.data().isClosed) {
          data.push(doc.data());
        }
      });
      setReportData([...data]);
      setLatitute(location.coords.latitude);
      setLongitute(location.coords.longitude);
      setIsLoading(false);
    });
  };

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  const getUserLocation = async () => {
    setErrorMsg("");
    try {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      ReportDispatch({
        type: "LOAD_LOCATION",
        payload: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
        },
      });
      fetchReports(location);
    } catch (error) {
      console.log(error);
      setErrorMsg(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserLocation();
    registerForPushNotificationsAsync().then((token) =>
      firebase
        .firestore()
        .doc(`/notificationTokens/${firebase.auth().currentUser.uid}`)
        .set({
          email: firebase.auth().currentUser.email,
          token,
          uid: firebase.auth().currentUser.uid,
        })
        .then()
        .catch((error) => console.log(error))
    );
  }, []);

  if (isLoading) {
    return <LoadingScreen text="Loading..." />;
  }
  if (errorMsg) {
    return (
      <View
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ padding: 20 }}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        display: "flex",
        flex: 1,
        backgroundColor: themeStyle.backgroundColor,
      }}
    >
      {!isLoading && (
        <View>
          <MapView
            ref={(ref) => (mapRef = ref)}
            provider={PROVIDER_GOOGLE}
            customMapStyle={mapTheme}
            loadingEnabled
            showsBuildings
            showsCompass
            showsUserLocation
            showsScale
            shouldRasterizeIOS
            showsTraffic
            style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
            initialRegion={{
              latitude: latitute,
              longitude: longitute,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            <MapView.Circle
              ref={circleRef}
              center={{
                latitude: latitute,
                longitude: longitute,
              }}
              radius={radiusInKM * 1000}
              strokeColor="#0AF"
              fillColor="rgba(0,170,255,0.2)"
            />
            {reportData.map((item, index) => {
              return (
                <RenderMarker
                  key={index}
                  title={item.animalType}
                  description={item.animalCount}
                  lat={item.animalMovingCoords.U}
                  long={item.animalMovingCoords.k}
                  handleOnPress={() => {
                    setSelectedAnimal({ ...item });
                    setSearchQuery(item.animalType);
                  }}
                />
              );
            })}
          </MapView>

          <Searchbar
            onChangeText={onChangeSearch}
            placeholder="Search"
            value={searchQuery}
            style={{
              backgroundColor: themeStyle.backgroundColor,
              position: "absolute",
              top: 10,
              margin: 10,
              color: themeStyle.textColor,
            }}
            theme={{
              colors: {
                placeholder: themeStyle.textColor,
                text: themeStyle.textColor,
              },
            }}
            icon="menu"
            onIconPress={() => navigation.toggleDrawer()}
            iconColor={themeStyle.textColor}
          />

          <FAB
            style={{
              position: "absolute",
              top: SCREEN_HEIGHT * 0.8,
              left: SCREEN_WIDTH * 0.8,
              backgroundColor: themeStyle.primaryColor,
            }}
            color="#FFF"
            icon="plus"
            onPress={() => navigation.navigate("ReportDrawer")}
          />

          {selectedAnimal && (
            <BottomSheet
              bottomSheerColor="#FFFFFF"
              initialPosition={"30%"} //200, 300
              snapPoints={["30%", "100%"]}
              isBackDropDismisByPress={true}
              isRoundBorderWithTipHeader={true}
              containerStyle={{
                backgroundColor: themeStyle.secondaryColor,
                zIndex: 99,
              }}
              header={
                <View>
                  <Text
                    style={{
                      fontSize: 30,
                      textTransform: "capitalize",
                      color: themeStyle.textColor,
                    }}
                  >
                    <Text>
                      {selectedAnimal.animalType === "other"
                        ? "Animal"
                        : selectedAnimal.animalType}
                    </Text>
                  </Text>
                </View>
              }
              body={
                <View
                  style={{
                    marginHorizontal: 30,
                    display: "flex",
                    height: SCREEN_HEIGHT * 0.8,
                    justifyContent: "space-evenly",
                    alignItems: "flex-start",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        color: themeStyle.textColor,
                        marginBottom: 10,
                        textTransform: "capitalize",
                      }}
                    >
                      Animal Count: {selectedAnimal.animalCount}
                    </Text>
                    <Text
                      style={{
                        color: themeStyle.textColor,
                        marginBottom: 10,
                        textTransform: "capitalize",
                      }}
                    >
                      Animal Condition: {selectedAnimal.animalCondition}
                    </Text>
                  </View>

                  <View style={{ marginTop: 50 }}>
                    <Text
                      style={{ color: themeStyle.textColor, marginBottom: 10 }}
                    >
                      Description: {selectedAnimal.description}
                    </Text>

                    <Text
                      style={{
                        color: themeStyle.textColor,
                        marginBottom: 10,
                        textTransform: "capitalize",
                      }}
                    >
                      Was{" "}
                      {selectedAnimal.animalType === "other"
                        ? "Animal"
                        : selectedAnimal.animalType}{" "}
                      moving ? : {selectedAnimal.animalIsMoving}
                    </Text>
                  </View>

                  <View>
                    <Lightbox navigator={navigator} style={{ marginTop: 30 }}>
                      <Image
                        style={{
                          height: 200,
                          width: SCREEN_WIDTH * 0.85,
                        }}
                        source={{
                          uri: selectedAnimal.animalImageUrl,
                        }}
                      />
                    </Lightbox>
                  </View>

                  <View>
                    <Card.Actions>
                      <Button color={themeStyle.textColor} icon="arrow-up-bold">
                        {selectedAnimal.upvotes.length}
                      </Button>
                      <Button
                        color={themeStyle.textColor}
                        icon="arrow-down-bold"
                      >
                        {selectedAnimal.downvotes.length}
                      </Button>
                      <Button color={themeStyle.textColor} icon="comment">
                        {selectedAnimal.comments.length}
                      </Button>
                    </Card.Actions>
                  </View>

                  <View>
                    <Text style={{ color: themeStyle.textSecondaryColor }}>
                      Added by: {selectedAnimal.email}
                    </Text>
                  </View>
                </View>
              }
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default Home;
