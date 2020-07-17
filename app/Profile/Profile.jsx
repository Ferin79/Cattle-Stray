import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Avatar, Title, Caption, Surface } from "react-native-paper";
import {
  Ionicons,
  MaterialCommunityIcons,
  Foundation,
  MaterialIcons,
} from "@expo/vector-icons";
import useTheme from "../hooks/useTheme";
import firebase from "../hooks/useFirebase";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const Profile = ({ navigation }) => {
  const themeStyle = useTheme();

  return (
    <SafeAreaView style={{ backgroundColor: themeStyle.backgroundColor }}>
      <ScrollView style={{ backgroundColor: themeStyle.backgroundColor }}>
        <View
          style={{
            marginHorizontal: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Ionicons
            name="ios-arrow-round-back"
            size={50}
            color={themeStyle.textColor}
            onPress={() => navigation.goBack()}
          />
          <MaterialCommunityIcons
            name="dots-vertical"
            size={35}
            color={themeStyle.textColor}
            onPress={() => navigation.toggleDrawer()}
          />
        </View>

        <Text
          style={{
            fontSize: 30,
            marginLeft: 30,
            fontWeight: "600",
            color: themeStyle.textSecondaryColor,
          }}
        >
          My Profile
        </Text>

        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Avatar.Image
            size={150}
            source={{ uri: firebase.auth().currentUser.photoURL }}
          />

          <Title style={{ marginVertical: 3, color: themeStyle.textColor }}>
            {firebase.auth().currentUser.displayName}
          </Title>
          <Caption style={{ color: themeStyle.textSecondaryColor }}>
            {firebase.auth().currentUser.email}
          </Caption>
        </View>

        <View
          style={{
            height: SCREEN_HEIGHT * 0.5,
            width: SCREEN_WIDTH,
            marginTop: 20,
          }}
        >
          <Surface
            style={{
              elevation: 5,
              height: SCREEN_HEIGHT,
              backgroundColor: themeStyle.secondaryColor,
              borderTopLeftRadius: 50,
              borderTopRightRadius: 50,
              borderBottomLeftRadius: 50,
              borderBottomRightRadius: 50,
            }}
          >
            <View
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "flex-start",
                width: SCREEN_WIDTH,
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("ListReports")}
              >
                <View
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexDirection: "row",
                    width: SCREEN_WIDTH,
                    marginHorizontal: 50,
                    marginVertical: 20,
                  }}
                >
                  <Foundation
                    name="page-doc"
                    size={35}
                    color={themeStyle.textColor}
                  />
                  <Text
                    style={{
                      fontSize: 20,
                      marginLeft: 30,
                      color: themeStyle.textColor,
                    }}
                  >
                    View Reports
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity>
                <View
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexDirection: "row",
                    width: SCREEN_WIDTH,
                    marginHorizontal: 50,
                    marginVertical: 20,
                    backgroundColor: "",
                  }}
                >
                  <MaterialIcons
                    name="person-outline"
                    size={35}
                    color={themeStyle.textColor}
                  />
                  <Text
                    style={{
                      fontSize: 20,
                      marginLeft: 30,
                      color: themeStyle.textColor,
                    }}
                  >
                    Edit Profile
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Surface>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
