import { useReducer } from "react";

const ThemeReducer = () => {
  const initialState = {
    lightTheme: true,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "START_DARK_MODE":
        return { ...state, lightTheme: false };
      case "END_DARK_MODE":
        return { ...state, lightTheme: true };
      default:
        return state;
    }
  };
  const [ThemeState, ThemeDispatch] = useReducer(reducer, initialState);
  return { ThemeState, ThemeDispatch };
};

export default ThemeReducer;
