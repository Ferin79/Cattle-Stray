import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../home/home";
import Feed from "../home/feed";
import ViewComments from "../home/ViewComments";

const HomeStackScreen = createStackNavigator();

const HomeStack = () => {
  return (
    <HomeStackScreen.Navigator>
      <HomeStackScreen.Screen
        component={Home}
        name="HomeStack"
        options={{ header: () => null }}
      />
      <HomeStackScreen.Screen
        component={Feed}
        name="FeedStack"
        options={{ header: () => null }}
      />
      <HomeStackScreen.Screen
        component={ViewComments}
        name="CommentStack"
        options={{
          headerTitle: "Comments",
          headerBackTitle: "Back",
          headerTitleAlign: "center",
        }}
      />
    </HomeStackScreen.Navigator>
  );
};

export default HomeStack;
