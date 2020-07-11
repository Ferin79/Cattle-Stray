import React from "react";
import { SafeAreaView, View, Text } from "react-native";
import { Button } from "react-native-paper";
import firebase from "../hooks/useFirebase";

const Settings = () => {
  return (
    <SafeAreaView>
      <View>
        <Text>Hi This is Settings Screen</Text>
        <Button
          style={{ width: 100 }}
          icon="camera"
          mode="outlined"
          onPress={() => firebase.auth().signOut()}
        >
          Logout
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
