import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { AppLoading } from "expo";
import { ContextProvider } from "./state/RootReducer";
import firebase from "./hooks/useFirebase";
import AuthStack from "./routes/AuthStack";
import Drawer from "./routes/Drawer";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  const checkAuth = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setIsLogin(true);
        setIsLoading(false);
      } else {
        setIsLogin(false);
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    return <AppLoading />;
  }

  return (
    <ContextProvider>
      <NavigationContainer>
        {isLogin ? <Drawer /> : <AuthStack />}
      </NavigationContainer>
      <StatusBar style="auto" />
    </ContextProvider>
  );
}
