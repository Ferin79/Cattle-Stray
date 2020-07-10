import { useReducer } from "react";

const ThemeReducer = () => {
  const initialState = {
    lightTheme: true,
  };

  const reducer = (state, action) => {
    switch (action) {
      case "TOGGLE_THEME":
        return state.lightTheme ? false : true;
      default:
        return;
    }
  };
  const [ThemeState, ThemeDispatch] = useReducer(reducer, initialState);
  return { ThemeState, ThemeDispatch };
};

export default ThemeReducer;
