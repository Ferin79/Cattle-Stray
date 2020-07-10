import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import useTheme from "../data/useTheme.js";
import { Feather, AntDesign } from "@expo/vector-icons";
import { Form, Item, Input } from "native-base";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const SignIn = () => {
  const themeStyle = useTheme();
  const [isSignInSelected, setIsSignInSelected] = useState(true);

  const SignInSlide = useState(new Animated.Value(0))[0];
  const SignUpSlide = useState(new Animated.Value(1000))[0];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  const TapSignUpAnimation = () => {
    Animated.sequence([
      Animated.timing(SignInSlide, {
        toValue: -1000,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(SignUpSlide, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const TapSignInAnimation = () => {
    Animated.sequence([
      Animated.timing(SignUpSlide, {
        toValue: 1000,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(SignInSlide, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView
        style={{
          display: "flex",
          height: SCREEN_HEIGHT,
          backgroundColor: themeStyle.backgroundColor,
        }}
      >
        {/* Header UI */}

        <View style={styles.headerStyle}>
          <View
            style={{
              padding: 10,
              backgroundColor: themeStyle.primaryColor,
              borderRadius: 10,
            }}
          >
            <Feather name="user" color="#FFF" size={30} />
          </View>

          <View
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              flexDirection: "row",
              width: SCREEN_WIDTH * 0.4,
            }}
          >
            <TouchableOpacity
              style={{
                borderBottomWidth: isSignInSelected ? 1 : null,
                paddingBottom: isSignInSelected ? 2 : null,
                borderBottomColor: themeStyle.textColor,
              }}
              onPress={() => {
                TapSignInAnimation();
                setIsSignInSelected(true);
              }}
            >
              <Text
                style={{
                  fontSize: isSignInSelected ? 16 : null,
                  fontWeight: isSignInSelected ? "600" : null,
                  color: themeStyle.textColor,
                }}
              >
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                borderBottomWidth: isSignInSelected ? null : 1,
                paddingBottom: isSignInSelected ? null : 2,
                borderBottomColor: themeStyle.textColor,
              }}
              onPress={() => {
                TapSignUpAnimation();
                setIsSignInSelected(false);
              }}
            >
              <Text
                style={{
                  fontSize: isSignInSelected ? null : 16,
                  fontWeight: isSignInSelected ? null : "600",
                  color: themeStyle.textColor,
                }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SignIn UI */}

        <Animated.View
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "space-evenly",
            marginTop: 30,
            position: "absolute",
            top: SCREEN_HEIGHT * 0.2,
            transform: [{ translateX: SignInSlide }],
          }}
        >
          <View
            style={{
              marginHorizontal: SCREEN_WIDTH * 0.1,
            }}
          >
            <Text style={{ fontSize: 35, color: themeStyle.textColor }}>
              Welcome <Text style={{ fontWeight: "600" }}>back,</Text>
            </Text>
            <Form style={{ marginVertical: SCREEN_HEIGHT * 0.075 }}>
              <Item>
                <Input
                  value={email}
                  placeholder="Email Address"
                  placeholderTextColor={themeStyle.textColor}
                  onChangeText={(event) => setEmail(event)}
                />
              </Item>
              <Item style={{ marginVertical: 25 }}>
                <Input
                  value={password}
                  placeholder="Password"
                  placeholderTextColor={themeStyle.textColor}
                  onChangeText={(event) => setPassword(event)}
                />
              </Item>
            </Form>
          </View>

          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              width: SCREEN_WIDTH,
              paddingHorizontal: SCREEN_WIDTH * 0.1,
            }}
          >
            <TouchableOpacity style={{ padding: 10 }}>
              <Text style={{ color: themeStyle.textColor }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <View
                style={{
                  padding: 10,
                  backgroundColor: themeStyle.accentColor,
                  borderRadius: 10,
                }}
              >
                <AntDesign name="arrowright" size={35} color="#FFF" />
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* SignUp UI */}
        <Animated.View
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "space-evenly",
            marginTop: 30,
            position: "absolute",
            top: SCREEN_HEIGHT * 0.2,
            transform: [{ translateX: SignUpSlide }],
          }}
        >
          <View
            style={{
              marginHorizontal: SCREEN_WIDTH * 0.1,
            }}
          >
            <Text style={{ fontSize: 35, color: themeStyle.textColor }}>
              Hello <Text style={{ fontWeight: "600" }}>Beautiful,</Text>
            </Text>
            <Text style={{ color: themeStyle.textColor }}>
              Enter your information below
            </Text>
            <Form style={{ marginVertical: SCREEN_HEIGHT * 0.075 }}>
              <Item>
                <Input
                  value={email}
                  placeholder="Email Address"
                  placeholderTextColor={themeStyle.textColor}
                  onChangeText={(event) => setEmail(event)}
                />
              </Item>
              <Item style={{ marginTop: 25 }}>
                <Input
                  value={password}
                  placeholder="Password"
                  placeholderTextColor={themeStyle.textColor}
                  onChangeText={(event) => setPassword(event)}
                />
              </Item>
              <Item style={{ marginVertical: 25 }}>
                <Input
                  value={passwordAgain}
                  placeholder="Password Again"
                  placeholderTextColor={themeStyle.textColor}
                  onChangeText={(event) => setPasswordAgain(event)}
                />
              </Item>
            </Form>
          </View>

          <View style={{ marginLeft: SCREEN_WIDTH * 0.75 }}>
            <TouchableOpacity>
              <View
                style={{
                  padding: 10,
                  backgroundColor: themeStyle.accentColor,
                  borderRadius: 10,
                  width: 60,
                }}
              >
                <AntDesign name="arrowright" size={35} color="#FFF" />
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  defaultFlexStyles: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  headerStyle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: SCREEN_WIDTH * 0.1,
    marginVertical: SCREEN_HEIGHT * 0.03,
  },
});
