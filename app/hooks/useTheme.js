import { useContext } from "react";
import { GlobalContext } from "../state/RootReducer";

const LIGHT_BACKGROUND_COLOR = "#FFF";
const LIGHT_PRIMARY_COLOR = "#0AF";
const LIGHT_ACCENT_COLOR = "#fd79a8";
const LIGHT_TEXT_COLOR = "#000";

const DARK_BACKGROUND_COLOR = "#121212";
const DARK_PRIMARY_COLOR = "#636e72";
const DARK_ACCENT_COLOR = "#636e72";
const DARK_TEXT_COLOR = "#FFF";

const useTheme = () => {
  const { ThemeState } = useContext(GlobalContext);

  const themeStyle = {};

  if (ThemeState.lightTheme) {
    themeStyle.backgroundColor = LIGHT_BACKGROUND_COLOR;
    themeStyle.primaryColor = LIGHT_PRIMARY_COLOR;
    themeStyle.accentColor = LIGHT_ACCENT_COLOR;
    themeStyle.textColor = LIGHT_TEXT_COLOR;
  } else {
    themeStyle.backgroundColor = DARK_BACKGROUND_COLOR;
    themeStyle.primaryColor = DARK_PRIMARY_COLOR;
    themeStyle.accentColor = DARK_ACCENT_COLOR;
    themeStyle.textColor = DARK_TEXT_COLOR;
  }
  return themeStyle;
};

export default useTheme;
