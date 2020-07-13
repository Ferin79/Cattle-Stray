import React, {
  useEffect,
  useContext,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
import { SafeAreaView, View, Dimensions } from "react-native";
import { Searchbar, FAB, Banner } from "react-native-paper";
import { GlobalContext } from "../state/RootReducer";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import useTheme from "../hooks/useTheme";
import useMapTheme from "../hooks/useMapTheme";
import LoadingScreen from "../hooks/LoadingScreen";
import firebase from "../hooks/useFirebase";
import * as geofirestore from "geofirestore";
import RenderMarker from "./RenderMarker";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const Home = ({ navigation }) => {
  const themeStyle = useTheme();
  const mapTheme = useMapTheme();

  const { ReportDispatch } = useContext(GlobalContext);

  const [latitute, setLatitute] = useState(0);
  const [longitute, setLongitute] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [reportData, setReportData] = useState([]);
  const [radiusInKM, setRadiusInKM] = useState(1);
  const [visible, setVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const circleRef = useRef();
  let mapRef = useRef();

  const onChangeSearch = (query) => setSearchQuery(query);

  useLayoutEffect(() => {
    setTimeout(() => {
      if (circleRef.current) {
        circleRef.current.setNativeProps({
          strokeColor: "#0AF",
          fillColor: "rgba(0,170,255,0.2)",
        });
      }
    }, 100);
  }, [reportData]);

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

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
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
    })();
  }, [radiusInKM]);

  if (isMapLoading) {
    return <LoadingScreen text="Loading..." />;
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
          <Banner
            style={{ zIndex: 9999 }}
            visible={visible}
            actions={[
              {
                label: "OK",
                onPress: () => setVisible(false),
              },
              {
                label: "Change Now",
                onPress: () => setVisible(false),
              },
            ]}
          >
            The Cattle Reports are only shown within the radius specified in
            Settings. You can change the radius according to your Preferences.
            Default Radius is 1 km.
          </Banner>

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
              top: SCREEN_HEIGHT * 0.7,
              left: SCREEN_WIDTH * 0.8,
              backgroundColor: themeStyle.accentColor,
            }}
            color={themeStyle.backgroundColor}
            icon="navigation"
            onPress={() =>
              mapRef.animateToRegion(
                {
                  latitude: latitute,
                  longitude: setLongitute,
                  latitudeDelta: 0.001,
                  longitudeDelta: 0.001,
                },
                1000
              )
            }
          />
          <FAB
            style={{
              position: "absolute",
              top: SCREEN_HEIGHT * 0.8,
              left: SCREEN_WIDTH * 0.8,
              backgroundColor: themeStyle.primaryColor,
            }}
            color={themeStyle.backgroundColor}
            icon="plus"
            onPress={() => navigation.navigate("ReportDrawer")}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Home;
