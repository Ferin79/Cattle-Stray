import React, { useEffect, useContext, useState } from "react";
import {
  SafeAreaView,
  View,
  Dimensions,
  PanResponder,
  Animated,
} from "react-native";
import { Searchbar, FAB } from "react-native-paper";
import { GlobalContext } from "../state/RootReducer";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import useTheme from "../hooks/useTheme";
import useMapTheme from "../hooks/useMapTheme";
import LoadingScreen from "../hooks/LoadingScreen";

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

  const [searchQuery, setSearchQuery] = React.useState("");

  const onChangeSearch = (query) => setSearchQuery(query);

  const pan = useState(
    new Animated.ValueXY({ x: 0, y: SCREEN_HEIGHT - 200 })
  )[0];

  const panResponder = useState(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.extractOffset();
        return true;
      },
      onPanResponderMove: (e, gestureState) => {
        pan.setValue({ x: 0, y: gestureState.dy });
      },
      onPanResponderRelease: (e, gestureState) => {
        console.log("MOVE Y: " + gestureState.moveY);
        console.log("DY: " + gestureState.dy);
        if (gestureState.moveY < 200) {
          Animated.spring(pan.y, {
            toValue: 0,
            tension: 1,
            useNativeDriver: true,
          }).start();
        } else if (gestureState.dy < 0) {
          Animated.spring(pan.y, {
            toValue: -SCREEN_HEIGHT + 200,
            tension: 1,
            useNativeDriver: true,
          }).start();
        } else if (gestureState.dy > 0) {
          Animated.spring(pan.y, {
            toValue: SCREEN_HEIGHT - 200,
            tension: 1,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  )[0];

  const animatedHeight = {
    transform: pan.getTranslateTransform(),
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log(location);
      ReportDispatch({
        type: "LOAD_LOCATION",
        payload: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
        },
      });
      setLatitute(location.coords.latitude);
      setLongitute(location.coords.longitude);
      setIsLoading(false);
      setIsMapLoading(false);
    })();
  }, []);

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
            style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
            initialRegion={{
              latitude: latitute,
              longitude: longitute,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          />

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
            color={themeStyle.backgroundColor}
            icon="plus"
            onPress={() => navigation.navigate("ReportDrawer")}
          />

          {/* <Animated.View
            style={[
              animatedHeight,
              {
                position: "absolute",
                right: 0,
                left: 0,
                width: SCREEN_WIDTH,
                height: SCREEN_HEIGHT,
                backgroundColor: "#0af",
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
                zIndex: 10,
              },
            ]}
            {...panResponder.panHandlers}
          >
            <View>
              <Text>Hi</Text>
            </View>
          </Animated.View> */}
        </View>
      )}
    </SafeAreaView>
  );
};

export default Home;
