import React, { createContext, useState } from "react";

export const Context = createContext();

export const ContextProvider = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState(null);
  const [reports, setReports] = useState([]);
    
  return (
    <Context.Provider
      value={{
        isLoading,setIsLoading,
        role,setRole,
        reports, setReports,        
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
