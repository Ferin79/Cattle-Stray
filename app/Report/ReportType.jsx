import React, { useContext } from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { Surface, RadioButton } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { GlobalContext } from "../state/RootReducer";
import useTheme from "../hooks/useTheme";

const ReportType = ({ navigation }) => {
  const themeStyle = useTheme();

  const { ReportState, ReportDispatch } = useContext(GlobalContext);

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

      <View style={{ backgroundColor: themeStyle.backgroundColor, margin: 25 }}>
        <Surface
          style={{
            backgroundColor: themeStyle.secondaryColor,
            elevation: 5,
          }}
        >
          <Text
            style={{
              fontSize: 30,
              marginVertical: 25,
              marginHorizontal: 30,
              color: themeStyle.textColor,
            }}
          >
            What kind of report is this ?
          </Text>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 20,
            }}
          >
            <RadioButton.Android
              value={ReportState.reportType}
              status={
                ReportState.reportType === "general" ? "checked" : "unchecked"
              }
              uncheckedColor={themeStyle.textColor}
              style={{ borderColor: themeStyle.textColor }}
              onPress={() =>
                ReportDispatch({ type: "SET_REPORT_TYPE", payload: "general" })
              }
            />
            <TouchableOpacity
              style={{ marginBottom: 20 }}
              onPress={() =>
                ReportDispatch({ type: "SET_REPORT_TYPE", payload: "general" })
              }
            >
              <Text style={{ fontSize: 20, color: themeStyle.textColor }}>
                General
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: themeStyle.textSecondaryColor,
                  marginVertical: 10,
                }}
              >
                For Example : Traffic Congestion, over-grazzing, grazzing in
                private property etc.
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 20,
              marginTop: 10,
            }}
          >
            <RadioButton.Android
              value={ReportState.reportType}
              status={
                ReportState.reportType === "health" ? "checked" : "unchecked"
              }
              uncheckedColor={themeStyle.textColor}
              style={{ borderColor: themeStyle.textColor }}
              onPress={() =>
                ReportDispatch({ type: "SET_REPORT_TYPE", payload: "health" })
              }
            />
            <TouchableOpacity
              onPress={() =>
                ReportDispatch({ type: "SET_REPORT_TYPE", payload: "health" })
              }
            >
              <Text style={{ fontSize: 20, color: themeStyle.textColor }}>
                Health
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: themeStyle.textSecondaryColor,
                  marginVertical: 10,
                }}
              >
                For Example : Animal is injuried, Animal is spreading disease,
                animal eating plastic etc.
              </Text>
            </TouchableOpacity>
          </View>
        </Surface>
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
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("QuestionPage1");
          }}
        >
          <Text style={{ color: "#FFF", fontSize: 20 }}>Start Reporting</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ReportType;
