import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../home/home";

const HomeStackScreen = createStackNavigator();

const HomeStack = () => {
  return (
    <HomeStackScreen.Navigator>
      <HomeStackScreen.Screen
        component={Home}
        name="HomeStack"
        options={{ header: () => null }}
      />
    </HomeStackScreen.Navigator>
  );
};

export default HomeStack;
