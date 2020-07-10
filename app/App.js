import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { AppLoading } from "expo";
import { Ionicons } from "@expo/vector-icons";
import AuthStack from "./routes/AuthStack";
import * as Font from "expo-font";
import { ContextProvider } from "./state/RootReducer";

export default function App() {
  const [isReady, setIsReady] = useState(false);

  const loadAssets = async () => {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      ...Ionicons.font,
    });
    setIsReady(true);
  };

  useEffect(() => {
    loadAssets();
  }, []);

  if (!isReady) {
    return <AppLoading />;
  }

  return (
    <ContextProvider>
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
      <StatusBar style="auto" />
    </ContextProvider>
  );
}
