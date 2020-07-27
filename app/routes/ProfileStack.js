import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../Profile/Profile";
import ListReports from "../Profile/ListReports";
import ViewComments from "../home/ViewComments";
import useTheme from "../hooks/useTheme";
import EditProfile from "../Profile/EditProfile";
import MapView from "../Profile/MapView";

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
      <ProfileStackScreen.Screen
        component={EditProfile}
        name="EditProfileStack"
        options={{
          header: () => null,
        }}
      />
      <ProfileStackScreen.Screen
        component={MapView}
        name="MapViewStack"
        options={{
          header: () => null,
        }}
      />
    </ProfileStackScreen.Navigator>
  );
};

export default ProfileStack;
