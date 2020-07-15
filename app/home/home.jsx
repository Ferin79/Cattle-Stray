import React, { useEffect, useContext, useState, useRef } from "react";
import { SafeAreaView, View, Dimensions, Text, YellowBox } from "react-native";
import { Searchbar, FAB } from "react-native-paper";
import _ from "lodash";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { GlobalContext } from "../state/RootReducer";
import useTheme from "../hooks/useTheme";
import useMapTheme from "../hooks/useMapTheme";
import LoadingScreen from "../hooks/LoadingScreen";
import firebase from "../hooks/useFirebase";
import * as geofirestore from "geofirestore";
import RenderMarker from "./RenderMarker";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const Home = ({ navigation }) => {
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
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [reportData, setReportData] = useState([]);
  const [radiusInKM, setRadiusInKM] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const circleRef = useRef();
  let mapRef = useRef();

  const onChangeSearch = (query) => setSearchQuery(query);

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
        data.push(doc.data());
      });
      setReportData([...data]);
      setLatitute(location.coords.latitude);
      setLongitute(location.coords.longitude);
      setIsLoading(false);
      setIsMapLoading(false);
    });
  };

  const getUserLocation = async () => {
    setErrorMsg("");
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    try {
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
      setIsLoading(false);
      setIsMapLoading(false);
      setErrorMsg(error.message);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  if (isMapLoading) {
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
            {reportData.length &&
              reportData.map((item, index) => {
                return (
                  <RenderMarker
                    key={index}
                    title={item.animalType}
                    description={item.description}
                    lat={item.animalMovingCoords.U}
                    long={item.animalMovingCoords.k}
                  />
                );
              })}
          </MapView>

          <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
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
            iconColor={themeStyle.textColor}
            onIconPress={() => navigation.toggleDrawer()}
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
        </View>
      )}
    </SafeAreaView>
  );
};

export default Home;
