import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StartPage from "../Report/StartPage";
import QuestionPage1 from "../Report/questionPage1";
import LocationPicker from "../Report/LocationPicker";
import ImagePicker from "../Report/ImagePicker";
import ReportSubmitted from "../Report/ReportSubmitted";
import ReportType from "../Report/ReportType";
import PickImage from "../auto/PickImage";

const ReportStackScreen = createStackNavigator();

const ReportStack = () => {
  return (
    <ReportStackScreen.Navigator>
      <ReportStackScreen.Screen
        name="StartPage"
        component={StartPage}
        options={{ header: () => null }}
      />
      <ReportStackScreen.Screen
        name="AutoInfo"
        component={PickImage}
        options={{ header: () => null }}
      />
      <ReportStackScreen.Screen
        name="QuestionPage1"
        component={QuestionPage1}
        options={{ header: () => null }}
      />
      <ReportStackScreen.Screen
        name="LocationPicker"
        component={LocationPicker}
        options={{ header: () => null }}
      />
      <ReportStackScreen.Screen
        name="ImagePicker"
        component={ImagePicker}
        options={{ header: () => null }}
      />
      <ReportStackScreen.Screen
        name="ReportSubmitted"
        component={ReportSubmitted}
        options={{ header: () => null }}
      />
      <ReportStackScreen.Screen
        name="PickReportType"
        component={ReportType}
        options={{ header: () => null }}
      />
    </ReportStackScreen.Navigator>
  );
};

export default ReportStack;
