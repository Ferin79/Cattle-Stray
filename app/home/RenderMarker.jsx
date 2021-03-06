import React from "react";
import { Marker } from "react-native-maps";

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
    <Marker
      title={title}
      description={`Last seen at ${description}`}
      coordinate={{
        latitude: parseFloat(lat) || 22.0162,
        longitude: parseFloat(long) || 72.0263,
      }}
      image={imgUrl}
      onPress={() => {
        handleOnPress();
      }}
    />
  );
};

export default RenderMarker;
