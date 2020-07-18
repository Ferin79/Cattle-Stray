import React, { useContext } from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import {
  Avatar,
  Title,
  Caption,
  Drawer as DrawerPaper,
  Text,
  TouchableRipple,
  Switch,
} from "react-native-paper";
import { View } from "react-native";
import {
  MaterialCommunityIcons,
  Foundation,
  FontAwesome5,
} from "@expo/vector-icons";
import useTheme from "../hooks/useTheme.js";
import { GlobalContext } from "../state/RootReducer";
import HomeStack from "./HomeStack";
import ProfileStack from "./ProfileStack";
import ReportStack from "./ReportStack";
import firebase from "../hooks/useFirebase";

const DrawerScreen = createDrawerNavigator();

const Drawer = () => {
  return (
    <DrawerScreen.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <DrawerScreen.Screen name="HomeDrawer" component={HomeStack} />
      <DrawerScreen.Screen name="ProfileDrawer" component={ProfileStack} />
      <DrawerScreen.Screen name="ReportDrawer" component={ReportStack} />
    </DrawerScreen.Navigator>
  );
};

const DrawerContent = (props) => {
  const { ThemeState, ThemeDispatch } = useContext(GlobalContext);
  const themeStyle = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: themeStyle.sidebarColor }}>
      <DrawerContentScrollView {...props}>
        <View style={{ flex: 1 }}>
          <View style={{ paddingLeft: 20 }}>
            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <Avatar.Image
                source={{
                  uri: firebase.auth().currentUser.photoURL
                    ? firebase.auth().currentUser.photoURL
                    : "https://firebasestorage.googleapis.com/v0/b/cattle-stray.appspot.com/o/dummyProfile%2Fperson.png?alt=media&token=a29add43-a17a-4d8b-a8be-71cb0d57c981",
                }}
                size={50}
              />
              <View style={{ marginLeft: 15, flexDirection: "column" }}>
                <Title
                  style={{
                    color: themeStyle.textColor,
                    textTransform: "capitalize",
                  }}
                >
                  {firebase.auth().currentUser.displayName}
                </Title>
                <Caption style={{ color: themeStyle.textColor }}>
                  {firebase.auth().currentUser.email}
                </Caption>
              </View>
            </View>
          </View>

          <DrawerPaper.Section style={{ marginTop: 15 }}>
            <DrawerItem
              label="Home"
              icon={({ size }) => (
                <MaterialCommunityIcons
                  name="home-outline"
                  color={themeStyle.textColor}
                  size={size}
                  onPress={() => {
                    props.navigation.navigate("HomeDrawer");
                  }}
                />
              )}
              onPress={() => {
                props.navigation.navigate("HomeDrawer");
              }}
              labelStyle={{ color: themeStyle.textColor }}
            />

            <DrawerItem
              label="Explore"
              icon={({ size }) => (
                <FontAwesome5
                  name="globe"
                  color={themeStyle.textColor}
                  size={size}
                  onPress={() => {
                    props.navigation.navigate("FeedStack");
                  }}
                />
              )}
              onPress={() => {
                props.navigation.navigate("FeedStack");
              }}
              labelStyle={{ color: themeStyle.textColor }}
            />

            <DrawerItem
              label="New Report"
              icon={({ size }) => (
                <Foundation
                  name="page-add"
                  color={themeStyle.textColor}
                  size={size}
                  onPress={() => {
                    props.navigation.navigate("ReportDrawer");
                  }}
                />
              )}
              onPress={() => {
                props.navigation.navigate("ReportDrawer");
              }}
              labelStyle={{ color: themeStyle.textColor }}
            />

            <DrawerItem
              onPress={() => props.navigation.navigate("ProfileDrawer")}
              label="Profile"
              icon={({ size }) => (
                <MaterialCommunityIcons
                  name="account-outline"
                  color={themeStyle.textColor}
                  size={size}
                  onPress={() => props.navigation.navigate("ProfileDrawer")}
                />
              )}
              labelStyle={{ color: themeStyle.textColor }}
            />
          </DrawerPaper.Section>

          <DrawerPaper.Section
            title="Preferences"
            theme={{ colors: { text: themeStyle.textSecondaryColor } }}
          >
            <TouchableRipple
              onPress={() => ThemeDispatch({ type: "TOGGLE_THEME" })}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                }}
              >
                <Text style={{ color: themeStyle.textColor }}>Dark Theme</Text>
                <Switch
                  value={!ThemeState.lightTheme}
                  onValueChange={() => ThemeDispatch({ type: "TOGGLE_THEME" })}
                />
              </View>
            </TouchableRipple>
          </DrawerPaper.Section>
        </View>
      </DrawerContentScrollView>
      <DrawerPaper.Section
        style={{
          marginBottom: 15,
          borderTopColor: "#f4f4f4",
          borderTopWidth: 1,
        }}
      >
        <DrawerItem
          onPress={() => firebase.auth().signOut()}
          labelStyle={{ color: themeStyle.textColor }}
          label="Sign Out"
          icon={({ size }) => (
            <MaterialCommunityIcons
              name="exit-to-app"
              color={themeStyle.textColor}
              size={size}
              onPress={() => {
                firebase.auth().signOut();
              }}
            />
          )}
        />
      </DrawerPaper.Section>
    </View>
  );
};
export default Drawer;
