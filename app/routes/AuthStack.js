import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SignIn from "../auth/SignIn";
import Intro from "../auth/Intro";
import LocateReport from "../auth/LocateReport";
import Votes from "../auth/Votes";

const AuthStackScreen = createStackNavigator();

const AuthStack = () => {
  return (
    <AuthStackScreen.Navigator initialRouteName="Intro">
      <AuthStackScreen.Screen
        component={SignIn}
        name="SignIn"
        options={{ header: () => null }}
      />
      <AuthStackScreen.Screen
        component={Intro}
        name="Intro"
        options={{ header: () => null }}
      />
      <AuthStackScreen.Screen
        component={LocateReport}
        name="LocateReport"
        options={{ header: () => null }}
      />
      <AuthStackScreen.Screen
        component={Votes}
        name="VoteReview"
        options={{ header: () => null }}
      />
    </AuthStackScreen.Navigator>
  );
};

export default AuthStack;
