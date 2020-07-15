import React, { useState, useEffect } from "react";
import { SafeAreaView, FlatList } from "react-native";
import { Surface, Title } from "react-native-paper";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import useTheme from "../hooks/useTheme";
import firebase from "../hooks/useFirebase";
import ViewReport from "./ViewReport";
import LoadingScreen from "../hooks/LoadingScreen";

const ListReports = ({ navigation }) => {
  const themeStyle = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [reportsData, setReportsData] = useState([]);

  const fetchReports = () => {
    firebase
      .firestore()
      .collection("reports")
      .where("uid", "==", firebase.auth().currentUser.uid)
      .orderBy("createdAt", "desc")
      .get()
      .then((docs) => {
        const data = [];
        docs.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
        setReportsData([...data]);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (isLoading) {
    return <LoadingScreen text="Loading Reports..." />;
  }

  return (
    <SafeAreaView>
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
        style={{ backgroundColor: themeStyle.backgroundColor }}
        data={reportsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ViewReport item={item} themeStyle={themeStyle} />
        )}
        refreshing={isLoading}
        onRefresh={() => fetchReports()}
      />
    </SafeAreaView>
  );
};
export default ListReports;
