import React, { useContext, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import * as Progress from "react-native-progress";
import { GlobalContext } from "../state/RootReducer";
import { Ionicons } from "@expo/vector-icons";
import { Button, Surface, TextInput, RadioButton } from "react-native-paper";
import useTheme from "../hooks/useTheme";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const QuestionPage1 = ({ navigation }) => {
  const themeStyle = useTheme();
  const { ReportState, ReportDispatch } = useContext(GlobalContext);

  const [selectedQuestion, setSelectedQuestion] = useState(1);
  const [percentage, setPercentage] = useState(0.25);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView
        style={{
          flex: 1,
          height: SCREEN_HEIGHT,
          width: SCREEN_WIDTH,
          backgroundColor: themeStyle.backgroundColor,
        }}
      >
        {selectedQuestion === 1 && (
          <Ionicons
            name="ios-arrow-round-back"
            size={40}
            color={themeStyle.textColor}
            onPress={() => {
              ReportDispatch({ type: "CLEAR_ALL" });
              navigation.goBack();
            }}
            style={{ position: "absolute", top: "3%", left: "5%", zIndex: 99 }}
          />
        )}
        <View
          style={{ paddingTop: 50, paddingHorizontal: 50, marginBottom: 10 }}
        >
          <Text style={{ color: themeStyle.textColor, fontSize: 25 }}>
            Question {selectedQuestion} / 4
          </Text>
          <Progress.Bar
            progress={percentage}
            width={SCREEN_WIDTH * 0.8}
            style={{ marginTop: 20 }}
            animated
            borderWidth={1}
            borderColor={themeStyle.primaryColor}
            color={themeStyle.primaryColor}
          />
        </View>

        {selectedQuestion === 1 && (
          <View
            style={{ backgroundColor: themeStyle.backgroundColor, margin: 25 }}
          >
            <Surface
              style={{
                backgroundColor: themeStyle.secondaryColor,
                elevation: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  marginVertical: 25,
                  marginHorizontal: 30,
                  color: themeStyle.textColor,
                }}
              >
                Select Animal!
              </Text>
              <View
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  height: SCREEN_HEIGHT * 0.5,
                }}
              >
                <TouchableWithoutFeedback
                  onPress={() =>
                    ReportDispatch({ type: "SET_TYPE", payload: "cow" })
                  }
                >
                  <Surface
                    style={{
                      elevation: 5,
                      width: "80%",
                      backgroundColor:
                        ReportState.animalType === "cow"
                          ? themeStyle.primaryColor
                          : themeStyle.secondaryColor,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        padding: 15,
                        color: themeStyle.textColor,
                      }}
                    >
                      Cow
                    </Text>
                  </Surface>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                  onPress={() =>
                    ReportDispatch({ type: "SET_TYPE", payload: "buffalo" })
                  }
                >
                  <Surface
                    style={{
                      elevation: 5,
                      width: "80%",
                      backgroundColor:
                        ReportState.animalType === "buffalo"
                          ? themeStyle.primaryColor
                          : themeStyle.secondaryColor,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        padding: 15,
                        color: themeStyle.textColor,
                      }}
                    >
                      Buffalo
                    </Text>
                  </Surface>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                  onPress={() =>
                    ReportDispatch({ type: "SET_TYPE", payload: "goat" })
                  }
                >
                  <Surface
                    style={{
                      elevation: 5,
                      width: "80%",
                      backgroundColor:
                        ReportState.animalType === "goat"
                          ? themeStyle.primaryColor
                          : themeStyle.secondaryColor,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        padding: 15,
                        color: themeStyle.textColor,
                      }}
                    >
                      Goat
                    </Text>
                  </Surface>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                  onPress={() =>
                    ReportDispatch({ type: "SET_TYPE", payload: "other" })
                  }
                >
                  <Surface
                    style={{
                      elevation: 5,
                      width: "80%",
                      backgroundColor:
                        ReportState.animalType === "other"
                          ? themeStyle.primaryColor
                          : themeStyle.secondaryColor,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        padding: 15,
                        color: themeStyle.textColor,
                      }}
                    >
                      Other
                    </Text>
                  </Surface>
                </TouchableWithoutFeedback>
              </View>
            </Surface>
          </View>
        )}

        {selectedQuestion === 2 && (
          <View
            style={{ backgroundColor: themeStyle.backgroundColor, margin: 25 }}
          >
            <Surface
              style={{
                backgroundColor: themeStyle.secondaryColor,
                elevation: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  marginVertical: 25,
                  marginHorizontal: 30,
                  color: themeStyle.textColor,
                }}
              >
                What is the condition of {ReportState.animalType}?
              </Text>
              <View
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  height: SCREEN_HEIGHT * 0.5,
                }}
              >
                <TouchableWithoutFeedback
                  onPress={() =>
                    ReportDispatch({ type: "SET_CONDITION", payload: "normal" })
                  }
                >
                  <Surface
                    style={{
                      elevation: 5,
                      width: "80%",
                      backgroundColor:
                        ReportState.animalCondition === "normal"
                          ? themeStyle.primaryColor
                          : themeStyle.secondaryColor,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        padding: 15,
                        color: themeStyle.textColor,
                      }}
                    >
                      Normal Condition
                    </Text>
                  </Surface>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                  onPress={() =>
                    ReportDispatch({
                      type: "SET_CONDITION",
                      payload: "injured",
                    })
                  }
                >
                  <Surface
                    style={{
                      elevation: 5,
                      width: "80%",
                      backgroundColor:
                        ReportState.animalCondition === "injured"
                          ? themeStyle.primaryColor
                          : themeStyle.secondaryColor,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        padding: 15,
                        color: themeStyle.textColor,
                      }}
                    >
                      Injured (Medical Condition)
                    </Text>
                  </Surface>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                  onPress={() =>
                    ReportDispatch({ type: "SET_CONDITION", payload: "death" })
                  }
                >
                  <Surface
                    style={{
                      elevation: 5,
                      width: "80%",
                      backgroundColor:
                        ReportState.animalCondition === "death"
                          ? themeStyle.primaryColor
                          : themeStyle.secondaryColor,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        padding: 15,
                        color: themeStyle.textColor,
                      }}
                    >
                      Death Condition
                    </Text>
                  </Surface>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                  onPress={() =>
                    ReportDispatch({ type: "SET_CONDITION", payload: "other" })
                  }
                >
                  <Surface
                    style={{
                      elevation: 5,
                      width: "80%",
                      backgroundColor:
                        ReportState.animalCondition === "other"
                          ? themeStyle.primaryColor
                          : themeStyle.secondaryColor,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        padding: 15,
                        color: themeStyle.textColor,
                      }}
                    >
                      Not Sure
                    </Text>
                  </Surface>
                </TouchableWithoutFeedback>
              </View>
            </Surface>
          </View>
        )}

        {selectedQuestion === 3 && (
          <View
            style={{ backgroundColor: themeStyle.backgroundColor, margin: 25 }}
          >
            <Surface
              style={{
                backgroundColor: themeStyle.secondaryColor,
                elevation: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  marginVertical: 25,
                  marginHorizontal: 30,
                  color: themeStyle.textColor,
                }}
              >
                How many {ReportState.animalType} did you see?
              </Text>

              <TextInput
                keyboardType="numeric"
                keyboardAppearance="dark"
                mode="outlined"
                label="Enter Count"
                value={ReportState.animalCount}
                placeholder="Example: 5"
                onChangeText={(event) =>
                  ReportDispatch({ type: "SET_COUNT", payload: event })
                }
                style={{
                  margin: 20,
                  backgroundColor: themeStyle.backgroundColor,
                }}
                theme={{
                  colors: {
                    placeholder: themeStyle.textColor,
                    text: themeStyle.textColor,
                  },
                }}
              />
            </Surface>
          </View>
        )}

        {selectedQuestion === 4 && (
          <View
            style={{ backgroundColor: themeStyle.backgroundColor, margin: 25 }}
          >
            <Surface
              style={{
                backgroundColor: themeStyle.secondaryColor,
                elevation: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  marginVertical: 25,
                  marginHorizontal: 30,
                  color: themeStyle.textColor,
                }}
              >
                Was {ReportState.animalType} moving?
              </Text>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: 20,
                }}
              >
                <RadioButton.Android
                  value={ReportState.animalIsMoving}
                  status={
                    ReportState.animalIsMoving === "yes"
                      ? "checked"
                      : "unchecked"
                  }
                  uncheckedColor={themeStyle.textColor}
                  style={{ borderColor: themeStyle.textColor }}
                  onPress={() =>
                    ReportDispatch({ type: "SET_MOVING", payload: "yes" })
                  }
                />
                <TouchableOpacity
                  onPress={() =>
                    ReportDispatch({ type: "SET_MOVING", payload: "yes" })
                  }
                >
                  <Text style={{ fontSize: 20, color: themeStyle.textColor }}>
                    Yes
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: 20,
                  marginTop: 10,
                }}
              >
                <RadioButton.Android
                  value={ReportState.animalIsMoving}
                  status={
                    ReportState.animalIsMoving === "no"
                      ? "checked"
                      : "unchecked"
                  }
                  uncheckedColor={themeStyle.textColor}
                  style={{ borderColor: themeStyle.textColor }}
                  onPress={() =>
                    ReportDispatch({ type: "SET_MOVING", payload: "no" })
                  }
                />
                <TouchableOpacity
                  onPress={() =>
                    ReportDispatch({ type: "SET_MOVING", payload: "no" })
                  }
                >
                  <Text style={{ fontSize: 20, color: themeStyle.textColor }}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </Surface>
          </View>
        )}

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            position: "absolute",
            bottom: "3%",
            right: "3%",
          }}
        >
          {selectedQuestion !== 1 && (
            <Button
              mode="outlined"
              color={themeStyle.primaryColor}
              onPress={() => {
                if (selectedQuestion !== 1) {
                  setSelectedQuestion(selectedQuestion - 1);
                  setPercentage(percentage - 0.25);
                }
              }}
              style={{ width: 150 }}
            >
              Previous
            </Button>
          )}
          {selectedQuestion !== 4 && (
            <Button
              mode="contained"
              color={themeStyle.primaryColor}
              labelStyle={{ color: "#fff" }}
              onPress={() => {
                if (selectedQuestion === 1) {
                  if (ReportState.animalType.trim() === "") {
                    Alert.alert("Error", "Please Select Animal");
                    return;
                  }
                }
                if (selectedQuestion === 2) {
                  if (ReportState.animalCondition.trim() === "") {
                    Alert.alert("Error", "Please Select Animal Condition");
                    return;
                  }
                }
                if (selectedQuestion === 3) {
                  if (!ReportState.animalCount) {
                    Alert.alert("Error", "Enter Animal Count");
                    return;
                  }
                }

                if (selectedQuestion !== 4) {
                  setSelectedQuestion(selectedQuestion + 1);
                  setPercentage(percentage + 0.25);
                }
              }}
              style={{ width: 150, marginLeft: 10 }}
            >
              Next
            </Button>
          )}

          {selectedQuestion === 4 && (
            <Button
              mode="contained"
              color={themeStyle.primaryColor}
              labelStyle={{ color: "#fff" }}
              onPress={() => {
                if (selectedQuestion === 4) {
                  if (ReportState.animalIsMoving.trim() === "") {
                    Alert.alert("Error", "Select Any Option");
                    return;
                  }
                }
                navigation.navigate("LocationPicker");
              }}
              style={{ width: 150, marginLeft: 10 }}
            >
              Next Step
            </Button>
          )}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default QuestionPage1;
