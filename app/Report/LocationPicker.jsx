import React, { useContext, useState } from "react";
import { SafeAreaView, View, Text, Dimensions } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { Button } from "react-native-paper";
import { GlobalContext } from "../state/RootReducer";
import useTheme from "../hooks/useTheme";
import useMapTheme from "../hooks/useMapTheme";
import RenderMarker from "../home/RenderMarker";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const LocationPicker = ({ navigation }) => {
  const { ReportState, ReportDispatch } = useContext(GlobalContext);

  const themeStyle = useTheme();
  const mapTheme = useMapTheme();

  const [isMarker, setIsMarker] = useState(false);

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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        height: SCREEN_HEIGHT,
        backgroundColor: themeStyle.backgroundColor,
      }}
    >
      <View style={{ margin: 20 }}>
        <Text style={{ fontSize: 25, color: themeStyle.textColor }}>
          Mark The Location
        </Text>
        <Text style={{ color: themeStyle.textColor }}>
          where you spot the {ReportState.animalType}
        </Text>
      </View>

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
        style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.6 }}
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
      <Text
        style={{
          margin: 10,
          fontSize: 18,
          color: themeStyle.textSecondaryColor,
        }}
      >
        Tap on map to mark the location
      </Text>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          position: "absolute",
          bottom: "3%",
          right: "3%",
        }}
      >
        <Button
          mode="outlined"
          color={themeStyle.primaryColor}
          onPress={() => {
            navigation.goBack();
          }}
          style={{ width: 150 }}
        >
          Back
        </Button>

        <Button
          mode="contained"
          disabled={isMarker ? false : true}
          color={themeStyle.primaryColor}
          labelStyle={{ color: "#fff" }}
          onPress={() => {
            navigation.navigate("ImagePicker");
          }}
          style={{ width: 150, marginLeft: 10 }}
        >
          Next Step
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default LocationPicker;
