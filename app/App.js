import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AppLoading } from "expo";
import * as Updates from "expo-updates";
import { ContextProvider } from "./state/RootReducer";
import firebase from "./hooks/useFirebase";
import AuthStack from "./routes/AuthStack";
import Drawer from "./routes/Drawer";
import SafeViewAndroid from "./hooks/SafeViewAndroid";

let IS_MOUNTED = false;

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  const checkAuth = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (IS_MOUNTED) {
        if (user) {
          setIsLoading(false);
          setIsLogin(true);
        } else {
          setIsLoading(false);
          setIsLogin(false);
        }
      }
    });
  };

  const checkUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        Alert.alert("The App is updating, Please don't close the app.");
        await Updates.reloadAsync();
      }
    } catch (error) {
      console.log(error);
      Alert.alert(error.message);
    }
  };

  useEffect(() => {
    IS_MOUNTED = true;
    checkAuth();
    checkUpdates();

    return () => {
      IS_MOUNTED = false;
    };
  }, []);

  if (isLoading) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={SafeViewAndroid.AndroidSafeArea}>
      <ContextProvider>
        <StatusBar style="auto" />
        <NavigationContainer>
          {isLogin ? <Drawer /> : <AuthStack />}
        </NavigationContainer>
      </ContextProvider>
    </SafeAreaView>
  );
}
