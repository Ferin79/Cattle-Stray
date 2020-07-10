import React, { createContext } from "react";
import ThemeReducer from "./ThemeReducer";
import AuthReducer from "./AuthReducer";

export const GlobalContext = createContext();

export const ContextProvider = ({ children }) => {
  const { AuthState, AuthDispatch } = AuthReducer();
  const { ThemeState, ThemeDispatch } = ThemeReducer();

  return (
    <GlobalContext.Provider
      value={{ AuthState, AuthDispatch, ThemeState, ThemeDispatch }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
