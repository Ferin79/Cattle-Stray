import { useReducer } from "react";

const LocationReducer = () => {
  const initialState = {
    latitude: "",
    longitude: "",
    accuracy: "",
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "LOAD_LOCATION":
        return {
          latitude: Number(action.payload.latitude),
          longitude: Number(action.payload.longitude),
          accuracy: Number(action.payload.accuracy),
        };

      case "SET_ERROR":
        return { ...state, isLoading: false, errorText: action.payload };
      default:
        return state;
    }
  };
  const [LocationState, LocationDispatch] = useReducer(reducer, initialState);

  return { LocationState, LocationDispatch };
};

export default LocationReducer;
