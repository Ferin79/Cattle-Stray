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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Feather, AntDesign } from "@expo/vector-icons";
import { TextInput, ActivityIndicator } from "react-native-paper";
import { handleSignUp, handleSignIn } from "../actions/AuthActions";
import useTheme from "../hooks/useTheme.js";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const SignIn = () => {
  const themeStyle = useTheme();

  const SignInSlide = useState(new Animated.Value(0))[0];
  const SignUpSlide = useState(new Animated.Value(1000))[0];

  const [isSignInSelected, setIsSignInSelected] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const TapSignUpAnimation = () => {
    setEmail("");
    setFirstname("");
    setLastname("");
    setPassword("");
    setPasswordAgain("");
    setErrorText("");
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
    setEmail("");
    setFirstname("");
    setLastname("");
    setPassword("");
    setPasswordAgain("");
    setErrorText("");
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
  const signUp = async () => {
    setErrorText("");
    if (firstname.trim() === "") {
      setErrorText("First Name cannot be empty");
      return;
    }
    if (lastname.trim() === "") {
      setErrorText("Last Name cannot be empty");
      return;
    }
    if (email.trim() === "") {
      setErrorText("Email cannot be empty");
      return;
    }
    if (password.trim() === "") {
      setErrorText("Password cannot be empty");
      return;
    }
    if (passwordAgain.trim() === "") {
      setErrorText("Repeat Password cannot be empty");
      return;
    }
    if (password !== passwordAgain) {
      setErrorText("Password does not match");
      return;
    }
    setIsLoading(true);
    handleSignUp(email, password, firstname, lastname)
      .then((user) => {
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
        setErrorText(error);
        setIsLoading(false);
      });
  };
  const handleSignInValide = () => {
    setErrorText("");
    if (email.trim() === "") {
      setErrorText("Email cannot be empty");
      return;
    }
    if (password.trim() === "") {
      setErrorText("Password cannot be empty");
      return;
    }

    setIsLoading(true);
    handleSignIn(email, password)
      .then(() => {})
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        setErrorText(error);
      });
  };

  return (
    <KeyboardAwareScrollView>
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
              <View style={{ marginVertical: SCREEN_HEIGHT * 0.075 }}>
                <TextInput
                  value={email}
                  placeholder="Email Address"
                  keyboardAppearance="dark"
                  onChangeText={(event) => setEmail(event)}
                  style={{
                    color: themeStyle.textColor,
                    backgroundColor: themeStyle.backgroundColor,
                  }}
                  keyboardType="email-address"
                  underlineColor={themeStyle.textColor}
                  theme={{
                    colors: {
                      placeholder: themeStyle.textSecondaryColor,
                      text: themeStyle.textColor,
                    },
                  }}
                />
                <TextInput
                  value={password}
                  placeholder="Password"
                  secureTextEntry
                  keyboardAppearance="dark"
                  onChangeText={(event) => setPassword(event)}
                  style={{
                    color: themeStyle.textColor,
                    backgroundColor: themeStyle.backgroundColor,
                    marginTop: 25,
                  }}
                  underlineColor={themeStyle.textColor}
                  theme={{
                    colors: {
                      placeholder: themeStyle.textSecondaryColor,
                      text: themeStyle.textColor,
                    },
                  }}
                />
                <Text
                  style={{
                    marginHorizontal: SCREEN_WIDTH * 0.05,
                    marginVertical: 25,
                    color: "red",
                  }}
                >
                  * {errorText}
                </Text>
              </View>
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
                    backgroundColor: themeStyle.primaryColor,
                    borderRadius: 10,
                  }}
                >
                  {isLoading ? (
                    <ActivityIndicator animating={true} color="#FFF" />
                  ) : (
                    <AntDesign
                      name="arrowright"
                      size={35}
                      color="#FFF"
                      onPress={() => handleSignInValide()}
                    />
                  )}
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
            </View>

            <View
              style={{
                marginHorizontal: SCREEN_WIDTH * 0.05,
              }}
            >
              <View style={{ marginVertical: SCREEN_HEIGHT * 0.075 }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <TextInput
                    value={firstname}
                    placeholder="First Name"
                    keyboardAppearance="dark"
                    placeholderTextColor={themeStyle.textColor}
                    onChangeText={(event) => setFirstname(event)}
                    style={{
                      width: "45%",
                      color: themeStyle.textColor,
                      backgroundColor: themeStyle.backgroundColor,
                    }}
                    underlineColor={themeStyle.textColor}
                    theme={{
                      colors: {
                        placeholder: themeStyle.textSecondaryColor,
                        text: themeStyle.textColor,
                      },
                    }}
                  />
                  <TextInput
                    value={lastname}
                    placeholder="Last Name"
                    keyboardAppearance="dark"
                    placeholderTextColor={themeStyle.textColor}
                    onChangeText={(event) => setLastname(event)}
                    style={{
                      width: "40%",
                      color: themeStyle.textColor,
                      backgroundColor: themeStyle.backgroundColor,
                    }}
                    underlineColor={themeStyle.textColor}
                    theme={{
                      colors: {
                        placeholder: themeStyle.textSecondaryColor,
                        text: themeStyle.textColor,
                      },
                    }}
                  />
                </View>
                <TextInput
                  value={email}
                  placeholder="Email Address"
                  keyboardType="email-address"
                  keyboardAppearance="dark"
                  placeholderTextColor={themeStyle.textColor}
                  onChangeText={(event) => setEmail(event)}
                  style={{
                    color: themeStyle.textColor,
                    backgroundColor: themeStyle.backgroundColor,
                    marginTop: 10,
                  }}
                  underlineColor={themeStyle.textColor}
                  theme={{
                    colors: {
                      placeholder: themeStyle.textSecondaryColor,
                      text: themeStyle.textColor,
                    },
                  }}
                />
                <TextInput
                  value={password}
                  placeholder="Password"
                  secureTextEntry
                  keyboardAppearance="dark"
                  placeholderTextColor={themeStyle.textColor}
                  onChangeText={(event) => setPassword(event)}
                  style={{
                    color: themeStyle.textColor,
                    backgroundColor: themeStyle.backgroundColor,
                    marginTop: 10,
                  }}
                  underlineColor={themeStyle.textColor}
                  theme={{
                    colors: {
                      placeholder: themeStyle.textSecondaryColor,
                      text: themeStyle.textColor,
                    },
                  }}
                />
                <TextInput
                  value={passwordAgain}
                  secureTextEntry
                  placeholder="Repeat Password"
                  keyboardAppearance="dark"
                  placeholderTextColor={themeStyle.textColor}
                  onChangeText={(event) => {
                    setPasswordAgain(event);
                  }}
                  style={{
                    color: themeStyle.textColor,
                    backgroundColor: themeStyle.backgroundColor,
                    marginTop: 10,
                  }}
                  underlineColor={themeStyle.textColor}
                  theme={{
                    colors: {
                      placeholder: themeStyle.textSecondaryColor,
                      text: themeStyle.textColor,
                    },
                  }}
                />
                <Text
                  style={{
                    marginTop: 10,
                    marginHorizontal: SCREEN_WIDTH * 0.05,
                    color: "red",
                  }}
                >
                  * {errorText}
                </Text>
              </View>
            </View>

            <View style={{ marginLeft: SCREEN_WIDTH * 0.75 }}>
              <View
                style={{
                  padding: 10,
                  backgroundColor: themeStyle.primaryColor,
                  borderRadius: 10,
                  width: 60,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator animating={true} color="#FFF" />
                ) : (
                  <AntDesign
                    name="arrowright"
                    size={35}
                    color="#FFF"
                    onPress={() => signUp()}
                  />
                )}
              </View>
            </View>
          </Animated.View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
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
