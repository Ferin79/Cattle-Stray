import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AppLoading } from "expo";
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

  useEffect(() => {
    IS_MOUNTED = true;
    checkAuth();

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
