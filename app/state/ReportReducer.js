import { useReducer } from "react";

const ReportReducer = () => {
  const initialState = {
    userCoords: {
      latitude: "",
      longitude: "",
    },
    animalType: "",
    animalCondition: "",
    animalCount: "",
    animalIsMoving: "",
    animalImageUrl: "",
    animalMovingCoords: {
      latitude: "",
      longitude: "",
    },
  };
  const reducer = (state, action) => {
    switch (action.type) {
      case "LOAD_LOCATION":
        return {
          ...state,
          userCoords: {
            latitude: action.payload.latitude,
            longitude: action.payload.longitude,
          },
        };
      case "SET_TYPE":
        return { ...state, animalType: action.payload };

      case "SET_CONDITION":
        return { ...state, animalCondition: action.payload };

      case "SET_COUNT":
        return { ...state, animalCount: action.payload };

      case "SET_MOVING":
        return { ...state, animalIsMoving: action.payload };

      case "SET_COORDINATE":
        return {
          ...state,
          animalMovingCoords: {
            latitude: action.payload.latitude,
            longitude: action.payload.longitude,
          },
        };

      case "CLEAR_ALL":
        return {
          ...state,
          animalType: "",
          animalCondition: "",
          animalCount: "",
          animalIsMoving: "",
          animalImageUrl: "",
          animalMovingCoords: "",
        };
      default:
        return state;
    }
  };
  const [ReportState, ReportDispatch] = useReducer(reducer, initialState);

  return { ReportState, ReportDispatch };
};

export default ReportReducer;
