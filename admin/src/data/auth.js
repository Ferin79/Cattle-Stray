import React, { createContext, useState, useEffect } from "react";
import firebase from "./firebase";
import { Context } from "./context";
import { useContext } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(false);
  const { setRole, setIsLoading } = useContext(Context);

  useEffect(() => {
    setIsLoading(true);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user.uid);
        firebase
          .firestore()
          .doc(`/organizations/${user.uid}`)
          .get()
          .then((snapshot) => {
            setCurrentUser(snapshot.data());
            setRole(snapshot.data().role);
            setIsLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setIsLoading(false);
          })
          .finally(() => {});
      } else {
        setIsLoading(false);
        setCurrentUser(null);
      }
    });
  }, [setCurrentUser, setRole, setIsLoading]);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}
