import { useReducer } from "react";

const ThemeReducer = () => {
  const initialState = {
    lightTheme: true,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "TOGGLE_THEME":
        return { ...state, lightTheme: !state.lightTheme };
      default:
        return state;
    }
  };
  const [ThemeState, ThemeDispatch] = useReducer(reducer, initialState);
  return { ThemeState, ThemeDispatch };
};

export default ThemeReducer;
