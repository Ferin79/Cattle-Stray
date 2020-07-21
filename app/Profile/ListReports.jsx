import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  Alert,
  Dimensions,
} from "react-native";
import { Surface, Title } from "react-native-paper";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import useTheme from "../hooks/useTheme";
import firebase from "../hooks/useFirebase";
import ViewReport from "./ViewReport";
import LoadingScreen from "../hooks/LoadingScreen";
import { handleVote } from "../actions/VoteActions";

const ListReports = ({ navigation }) => {
  const themeStyle = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [reportsData, setReportsData] = useState([]);

  const fetchReports = () => {
    try {
      firebase
        .firestore()
        .doc(`/users/${firebase.auth().currentUser.uid}`)
        .get()
        .then((userDoc) => {
          firebase
            .firestore()
            .collection("reports")
            .where("uid", "==", firebase.auth().currentUser.uid)
            .orderBy("createdAt", "desc")
            .onSnapshot((docs) => {
              const data = [];
              docs.forEach((doc) => {
                data.push({
                  ...doc.data(),
                  id: doc.id,
                  displayName: `${userDoc.data().firstname} ${
                    userDoc.data().lastname
                  }`,
                  points: userDoc.data().points,
                  photoUrl: userDoc.data().photoUrl,
                });
              });
              setReportsData([...data]);
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
    fetchReports();
  }, []);

  if (isLoading) {
    return <LoadingScreen text="Loading Reports..." />;
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: themeStyle.backgroundColor }}
    >
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
        style={{ backgroundColor: themeStyle.backgroundColor }}
        data={reportsData}
        keyExtractor={(item) => item.id}
        refreshing={isLoading}
        onRefresh={() => fetchReports()}
        renderItem={({ item }) => (
          <ViewReport
            item={item}
            themeStyle={themeStyle}
            handleVote={handleVote}
            navigation={navigation}
          />
        )}
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
        ListFooterComponent={() => <View style={{ height: 100 }} />}
      />
    </SafeAreaView>
  );
};
export default ListReports;
