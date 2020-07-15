import React from "react";
import { MarkerAnimated } from "react-native-maps";

const RenderMarker = ({ title, description, lat, long, handleOnPress }) => {
  var imgUrl;
  if (title === "cow") {
    imgUrl = require("../images/cow.png");
  } else if (title === "buffalo") {
    imgUrl = require("../images/buffalo.png");
  } else if (title === "goat") {
    imgUrl = require("../images/goat.png");
  }
  return (
    <MarkerAnimated
      title={title === "other" ? "Animal" : title}
      description={`${description} ${
        title === "other" ? "Animal" : title
      } was located here`}
      coordinate={{
        latitude: parseFloat(lat),
        longitude: parseFloat(long),
      }}
      image={imgUrl}
      onPress={() => {
        handleOnPress();
      }}
    />
  );
};

export default RenderMarker;
