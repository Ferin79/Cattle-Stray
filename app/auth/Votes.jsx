import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Animated, Text } from "react-native";
import { Button } from "react-native-paper";

const Votes = ({ navigation }) => {
  const animatedImage = useState(new Animated.Value(0))[0];
  const animatedButton = useState(new Animated.Value(500))[0];
  const animateTitle = useState(new Animated.Value(5))[0];
  const animateSubTitle = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(animatedImage, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    Animated.sequence([
      Animated.timing(animateTitle, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(animateSubTitle, {
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
      <View
        style={{
          flex: 1.5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Animated.Image
          source={require("../images/review.png")}
          style={{
            height: 250,
            width: 350,
            opacity: animatedImage,
          }}
        />
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: "#0AF",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <Animated.Text
          style={{
            fontSize: 40,
            color: "#FFF",
            fontWeight: "700",
            transform: [{ scale: animateTitle }],
          }}
        >
          Votes {"&"} Reviews
        </Animated.Text>
        <Animated.Text
          style={{
            color: "#fff",
            marginHorizontal: 50,
            fontSize: 18,
            transform: [
              {
                scale: animateSubTitle,
              },
            ],
          }}
        >
          If you find the same report while reporting you can upvote the
          existing one!
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
          onPress={() => navigation.navigate("SignIn")}
        >
          Sign In
        </Button>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Votes;
