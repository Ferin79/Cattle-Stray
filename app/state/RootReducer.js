import React, { createContext } from "react";
import ThemeReducer from "./ThemeReducer";
import LocationReducer from "./LocationReducer";

export const GlobalContext = createContext();

export const ContextProvider = ({ children }) => {
  const { ThemeState, ThemeDispatch } = ThemeReducer();
  const { LocationState, LocationDispatch } = LocationReducer();

  return (
    <GlobalContext.Provider
      value={{
        ThemeState,
        ThemeDispatch,
        LocationState,
        LocationDispatch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
