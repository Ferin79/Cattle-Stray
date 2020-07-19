import React, { createContext, useState } from "react";
import ThemeReducer from "./ThemeReducer";
import ReportReducer from "./ReportReducer";

export const GlobalContext = createContext();

export const ContextProvider = ({ children }) => {
  const { ThemeState, ThemeDispatch } = ThemeReducer();
  const { ReportState, ReportDispatch } = ReportReducer();
  const [Radius, setRadius] = useState(1);

  return (
    <GlobalContext.Provider
      value={{
        ThemeState,
        ThemeDispatch,
        ReportState,
        ReportDispatch,
        Radius,
        setRadius,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
