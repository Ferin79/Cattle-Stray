import React, { useContext } from "react";
import { SafeAreaView, Dimensions, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import useTheme from "../hooks/useTheme";
import useMapTheme from "../hooks/useMapTheme";
import { GlobalContext } from "../state/RootReducer";
import RenderMarker from "../home/RenderMarker";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const MapViewScreen = ({ navigation, route }) => {
  const coords = JSON.parse(route.params.coords);

  const themeStyle = useTheme();
  const mapTheme = useMapTheme();

  const { ReportState } = useContext(GlobalContext);

  return (
    <SafeAreaView
      style={{
        display: "flex",
        flex: 1,
        backgroundColor: themeStyle.backgroundColor,
      }}
    >
      <View
        style={{
          marginHorizontal: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Ionicons
          name="ios-arrow-round-back"
          size={50}
          color={themeStyle.textColor}
          onPress={() => navigation.goBack()}
        />
        <MaterialCommunityIcons
          name="menu"
          size={35}
          color={themeStyle.textColor}
          onPress={() => navigation.toggleDrawer()}
        />
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
        style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
        initialRegion={{
          latitude: ReportState.userCoords.latitude,
          longitude: ReportState.userCoords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <RenderMarker lat={coords.U} long={coords.k} />
      </MapView>
    </SafeAreaView>
  );
};

export default MapViewScreen;
