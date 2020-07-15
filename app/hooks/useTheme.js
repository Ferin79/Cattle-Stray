import { useContext } from "react";
import { GlobalContext } from "../state/RootReducer";

const LIGHT_BACKGROUND_COLOR = "#FFF";
const LIGHT_SIDEBAR_COLOR = "#FFF";
const LIGHT_PRIMARY_COLOR = "#0AF";
const LIGHT_SECONDARY_COLOR = "#FFFAFA";
const LIGHT_TEXT_COLOR = "#000";
const LIGHT_TEXT_SECONDARY_COLOR = "rgba(0,0,0,0.7)";

const DARK_BACKGROUND_COLOR = "#121212";
const DARK_SIDEBAR_COLOR = "#2d3436";
const DARK_PRIMARY_COLOR = "#0AF";
const DARK_SECONDARY_COLOR = "#2d3436";
const DARK_TEXT_COLOR = "#FFF";
const DARK_TEXT_SECONDARY_COLOR = "rgba(255,255,255,0.7)";

const useTheme = () => {
  const { ThemeState } = useContext(GlobalContext);

  const themeStyle = {};

  if (ThemeState.lightTheme) {
    themeStyle.backgroundColor = LIGHT_BACKGROUND_COLOR;
    themeStyle.primaryColor = LIGHT_PRIMARY_COLOR;
    themeStyle.secondaryColor = LIGHT_SECONDARY_COLOR;
    themeStyle.textColor = LIGHT_TEXT_COLOR;
    themeStyle.sidebarColor = LIGHT_SIDEBAR_COLOR;
    themeStyle.textSecondaryColor = LIGHT_TEXT_SECONDARY_COLOR;
  } else {
    themeStyle.backgroundColor = DARK_BACKGROUND_COLOR;
    themeStyle.primaryColor = DARK_PRIMARY_COLOR;
    themeStyle.secondaryColor = DARK_SECONDARY_COLOR;
    themeStyle.textColor = DARK_TEXT_COLOR;
    themeStyle.sidebarColor = DARK_SIDEBAR_COLOR;
    themeStyle.textSecondaryColor = DARK_TEXT_SECONDARY_COLOR;
  }
  return themeStyle;
};

export default useTheme;
