import React, { createContext } from "react";
import ThemeReducer from "./ThemeReducer";
import ReportReducer from "./ReportReducer";

export const GlobalContext = createContext();

export const ContextProvider = ({ children }) => {
  const { ThemeState, ThemeDispatch } = ThemeReducer();
  const { ReportState, ReportDispatch } = ReportReducer();

  return (
    <GlobalContext.Provider
      value={{
        ThemeState,
        ThemeDispatch,
        ReportState,
        ReportDispatch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
