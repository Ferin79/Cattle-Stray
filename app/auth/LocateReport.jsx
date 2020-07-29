import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Animated, Image, Dimensions } from "react-native";
import { Button } from "react-native-paper";

const { width } = Dimensions.get("window");

const LocateReport = ({ navigation }) => {
  const animatedMarker = useState(new Animated.Value(-500))[0];
  const animatedCircle = useState(new Animated.Value(0))[0];
  const animatedChart = useState(new Animated.Value(500))[0];
  const animatedButton = useState(new Animated.Value(500))[0];
  const animatedTitle = useState(new Animated.Value(500))[0];
  const animatedSubTitle = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.sequence([
      Animated.timing(animatedMarker, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(animatedCircle, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
    Animated.timing(animatedChart, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
    Animated.sequence([
      Animated.timing(animatedTitle, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
        delay: 200,
      }),
      Animated.timing(animatedSubTitle, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(animatedButton, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={{ display: "flex", flex: 1 }}>
      <View style={{ flex: 1.5, position: "relative" }}>
        <Image
          source={require("../images/mapui.png")}
          style={{
            flex: 1,
            width: width,
          }}
        />

        <Animated.Image
          source={require("../images/marker.png")}
          style={{
            transform: [
              {
                translateX: animatedMarker,
              },
            ],
            height: 150,
            width: 112.5,
            position: "absolute",
            top: "10%",
            left: "10%",
          }}
        />
        <Animated.Image
          source={require("../images/ellipse.png")}
          style={{
            height: 200,
            width: 205,
            opacity: animatedCircle,
            position: "absolute",
            top: "20%",
            left: "0%",
          }}
        />
        <Animated.Image
          source={require("../images/chart.png")}
          style={{
            transform: [
              {
                translateX: animatedChart,
              },
            ],
            height: 200,
            width: 170.5,
            position: "absolute",
            right: "5%",
            bottom: "10%",
          }}
        />
      </View>

      <View
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          backgroundColor: "#0AF",
        }}
      >
        <Animated.Text
          style={{
            fontSize: 40,
            color: "#FFF",
            fontWeight: "700",
            transform: [{ translateY: animatedTitle }],
          }}
        >
          Locate {"&"} Report
        </Animated.Text>
        <Animated.Text
          style={{
            color: "#fff",
            marginHorizontal: 50,
            fontSize: 18,
            opacity: animatedSubTitle,
          }}
        >
          Locate the cattle in your locality and report with a breeze
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
          onPress={() => navigation.navigate("VoteReview")}
        >
          Next
        </Button>
      </Animated.View>
    </SafeAreaView>
  );
};

export default LocateReport;
