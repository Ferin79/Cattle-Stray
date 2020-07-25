import React, { useState, useEffect, useContext } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Alert,
  Text,
  Dimensions,
} from "react-native";
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
  const { ReportState, Radius } = useContext(GlobalContext);

  const themeStyle = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [feedData, setFeedData] = useState([]);

  const fetchFeedData = () => {
    try {
      setIsLoading(true);
      let users = [];

      var firebaseRef = firebase.firestore();
      const GeoFirestore = geofirestore.initializeApp(firebaseRef);
      const geocollection = GeoFirestore.collection("reports");

      firebase
        .firestore()
        .collection("users")
        .get()
        .then((docs) => {
          docs.forEach((doc) => {
            users.push({ ...doc.data() });
          });
        })
        .then(() => {
          const query = geocollection.near({
            center: new firebase.firestore.GeoPoint(
              ReportState.userCoords.latitude,
              ReportState.userCoords.longitude
            ),
            radius: Number(Radius),
          });

          query.onSnapshot((value) => {
            const data = [];
            value.docs.forEach((doc) => {
              if (!doc.data().isRejected) {
                users.forEach((item) => {
                  if (
                    !doc.data().isRejected &&
                    !doc.data().isResolved &&
                    doc.data().reportType !== "health"
                  ) {
                    if (doc.data().uid === item.uid) {
                      data.push({
                        ...doc.data(),
                        id: doc.id,
                        displayName: `${item.firstname} ${item.lastname}`,
                        points: item.points,
                        photoUrl: item.photoUrl,
                      });
                    }
                  }
                });
              }
            });
            setFeedData([...data]);
          });
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
      Alert.alert("Somthing Went Wrong", error.message);
    }
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
            name="menu"
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
          ListFooterComponent={() => <View style={{ height: 100 }} />}
          ListEmptyComponent={() => (
            <View
              style={{
                display: "flex",
                height: Dimensions.get("window").height * 0.8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: themeStyle.textColor, fontSize: 20 }}>
                No Reports to Show
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Feed;
