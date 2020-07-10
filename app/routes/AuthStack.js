import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SignIn from "../auth/SignIn";

const AuthStackScreen = createStackNavigator();

const AuthStack = () => {
  return (
    <AuthStackScreen.Navigator>
      <AuthStackScreen.Screen
        component={SignIn}
        name="SignIn"
        options={{ header: () => null }}
      />
    </AuthStackScreen.Navigator>
  );
};

export default AuthStack;
