import React, { useContext, useEffect } from "react";
import { Button } from "react-native-paper";
import { SafeAreaView, Image, Dimensions } from "react-native";
import { GlobalContext } from "../state/RootReducer";

const ReportSubmitted = ({ navigation }) => {
  const { ReportDispatch } = useContext(GlobalContext);

  useEffect(() => {
    ReportDispatch({ type: "CLEAR_ALL" });
  }, []);

  return (
    <SafeAreaView
      style={{
        display: "flex",
        flex: 1,
        backgroundColor: "#FFF",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../images/complete.gif")}
        style={{
          height: Dimensions.get("window").height * 0.5,
          width: Dimensions.get("window").width,
        }}
      />
      <Button
        mode="contained"
        style={{ position: "absolute", top: "80%", backgroundColor: "#0af" }}
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: "HomeDrawer" }],
          })
        }
      >
        Done, Thank You
      </Button>
    </SafeAreaView>
  );
};

export default ReportSubmitted;
