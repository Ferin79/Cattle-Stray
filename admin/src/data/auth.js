import React, { createContext, useState, useEffect } from "react";
import firebase from "./firebase";
import { Context } from "./context";
import { useContext } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(false);
  const { setRole } = useContext(Context);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {        
        firebase.firestore().doc(`users/${user.uid}`).get()
          .then((snapshot) => {
            console.log(snapshot.data().role);
            setCurrentUser(snapshot.data());
            setRole(snapshot.data().role);
            console.log(snapshot.data().role)
          });
      } else {
        setCurrentUser(null);
      }
    });

  }, [setCurrentUser, setRole]);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}
