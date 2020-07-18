import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView, View, FlatList } from "react-native";
import { Surface, Title } from "react-native-paper";
import * as geofirestore from "geofirestore";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import firebase from "../hooks/useFirebase";
import { GlobalContext } from "../state/RootReducer";
import LoadingScreen from "../hooks/LoadingScreen";
import ViewReport from "../Profile/ViewReport";
import useTheme from "../hooks/useTheme";
import { handleVote } from "../actions/VoteActions";

const Feed = ({ navigation }) => {
  const { ReportState } = useContext(GlobalContext);

  const themeStyle = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [radiusInKM, setRadiusInKM] = useState(1);
  const [feedData, setFeedData] = useState([]);

  const fetchFeedData = () => {
    setIsLoading(true);
    var firebaseRef = firebase.firestore();
    const GeoFirestore = geofirestore.initializeApp(firebaseRef);
    const geocollection = GeoFirestore.collection("reports");

    // Create a GeoQuery based on a location
    const query = geocollection.near({
      center: new firebase.firestore.GeoPoint(
        ReportState.userCoords.latitude,
        ReportState.userCoords.longitude
      ),
      radius: radiusInKM,
    });

    // Get query (as Promise)
    query.onSnapshot((value) => {
      const data = [];
      value.docs.forEach((doc) => {
        if (!doc.data().isClosed) {
          data.push({ ...doc.data(), id: doc.id });
        }
      });
      setFeedData([...data]);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchFeedData();
  }, []);

  if (isLoading) {
    return <LoadingScreen text="Loading Reports..." />;
  }
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: themeStyle.backgroundColor }}
    >
      <View>
        <Surface
          style={{
            elevation: 5,
            paddingHorizontal: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            backgroundColor: themeStyle.backgroundColor,
          }}
        >
          <Ionicons
            name="ios-arrow-round-back"
            size={50}
            color={themeStyle.textColor}
            onPress={() => navigation.goBack()}
          />
          <Title style={{ color: themeStyle.textColor }}>Reports</Title>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={35}
            color={themeStyle.textColor}
            onPress={() => navigation.toggleDrawer()}
          />
        </Surface>
        <FlatList
          data={feedData}
          refreshing={isLoading}
          onRefresh={() => fetchFeedData()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ViewReport
              item={item}
              themeStyle={themeStyle}
              handleVote={handleVote}
              navigation={navigation}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Feed;
