import React, { createContext, useState } from "react";

export const Context = createContext();

export const ContextProvider = (props) => {
  const [isLoading, setIsLoading] = useState(false);
    
  return (
    <Context.Provider
      value={{
        isLoading,
        setIsLoading,        
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
