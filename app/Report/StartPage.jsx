import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../hooks/useTheme";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const StartPage = ({ navigation }) => {
  const themeStyle = useTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: themeStyle.backgroundColor }}
    >
      <View>
        <View
          style={{
            paddingHorizontal: 25,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="ios-arrow-round-back"
            size={50}
            color={themeStyle.textColor}
            onPress={() => navigation.goBack()}
          />
          <Ionicons
            name="ios-menu"
            size={30}
            color={themeStyle.textColor}
            onPress={() => navigation.toggleDrawer()}
          />
        </View>

        <Image
          source={require("../images/cowLight.gif")}
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT * 0.5,
            backgroundColor: themeStyle.backgroundColor,
          }}
        />

        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 35, color: themeStyle.textColor }}>
            New Report
          </Text>
          <Text
            style={{
              paddingVertical: 10,
              color: themeStyle.textSecondaryColor,
            }}
          >
            By reporting these questions, you can help solving the cattle on
            road and traffic issue.
          </Text>
          <Text style={{ paddingVertical: 10, color: "red" }}>
            Note: Your location at the time of reporting will be noted.
          </Text>
        </View>
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          padding: 25,
          backgroundColor: themeStyle.primaryColor,
          borderTopLeftRadius: 50,
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("QuestionPage1")}>
          <Text style={{ color: "#FFF", fontSize: 20 }}>Start Reporting</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StartPage;
