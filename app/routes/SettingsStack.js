import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Settings from "../settings/settings";

const SettingStackScreen = createStackNavigator();

const SettingStack = () => {
  return (
    <SettingStackScreen.Navigator>
      <SettingStackScreen.Screen
        component={Settings}
        name="SettingsStack"
        options={{ header: () => null }}
      />
    </SettingStackScreen.Navigator>
  );
};

export default SettingStack;
