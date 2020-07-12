import React from "react";
import { ActivityIndicator, Title } from "react-native-paper";
import { SafeAreaView } from "react-native";
import useTheme from "./useTheme";

const LoadingScreen = ({ text }) => {
  const themeStyle = useTheme();
  return (
    <SafeAreaView
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: themeStyle.backgroundColor,
      }}
    >
      <ActivityIndicator size="large" color="#0af" />
      <Title style={{ color: themeStyle.textColor, marginTop: 25 }}>
        {text}
      </Title>
    </SafeAreaView>
  );
};

export default LoadingScreen;
