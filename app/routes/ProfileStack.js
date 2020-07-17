import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../Profile/Profile";
import ListReports from "../Profile/ListReports";
import ViewComments from "../home/ViewComments";
import useTheme from "../hooks/useTheme";

const ProfileStackScreen = createStackNavigator();

const ProfileStack = () => {
  const themeStyle = useTheme();

  return (
    <ProfileStackScreen.Navigator>
      <ProfileStackScreen.Screen
        component={Profile}
        name="ProfileStack"
        options={{ header: () => null }}
      />
      <ProfileStackScreen.Screen
        component={ListReports}
        name="ListReports"
        options={{ header: () => null }}
      />
      <ProfileStackScreen.Screen
        component={ViewComments}
        name="CommentStack"
        options={{
          headerTitle: "Comments",
          headerBackTitle: "Back",
          headerTitleAlign: "center",
        }}
      />
    </ProfileStackScreen.Navigator>
  );
};

export default ProfileStack;
