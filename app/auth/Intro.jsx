import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Dimensions, Text, Animated } from "react-native";
import { Button } from "react-native-paper";

const { height, width } = Dimensions.get("window");

const Intro = ({ navigation }) => {
  const animatedIcon = useState(new Animated.Value(500))[0];
  const animatedText = useState(new Animated.Value(-500))[0];
  const animatedButton = useState(new Animated.Value(500))[0];

  useEffect(() => {
    Animated.timing(animatedIcon, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
    Animated.timing(animatedText, {
      toValue: 0,
      duration: 750,
      useNativeDriver: true,
    }).start();
    Animated.timing(animatedButton, {
      toValue: 0,
      duration: 750,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "space-evenly",
          alignItems: "center",
          height: height,
          width: width,
          backgroundColor: "#0AF",
        }}
      >
        <Animated.Image
          source={require("../images/icon.png")}
          width={width}
          height="auto"
          style={{
            transform: [
              {
                translateX: animatedIcon,
              },
            ],
          }}
        />
        <Animated.Text
          style={{
            transform: [
              {
                translateX: animatedText,
              },
            ],
            fontSize: 40,
            color: "#fff",
            fontWeight: "700",
            textShadowColor: "rgba(0, 0, 0, 0.75)",
            textShadowOffset: { width: -1, height: 1 },
            textShadowRadius: 10,
          }}
        >
          Cattle Stray
        </Animated.Text>
      </View>
      <Animated.View
        style={{
          position: "absolute",
          bottom: "3%",
          right: "5%",
          transform: [
            {
              translateY: animatedButton,
            },
          ],
        }}
      >
        <Button
          icon="arrow-right"
          mode="contained"
          style={{
            backgroundColor: "#DEA986",
          }}
          onPress={() => navigation.navigate("LocateReport")}
        >
          Next
        </Button>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Intro;
