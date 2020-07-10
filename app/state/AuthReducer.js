import { useReducer } from "react";

const AuthReducer = () => {
  const initialState = {
    isLoading: false,
  };

  const reducer = (state, action) => {
    switch (action) {
      case "NOT_LOADING":
        return (state.isLoading = false);
      case "LOADING":
        return (state.isLoading = true);
      default:
        return;
    }
  };
  const [AuthState, AuthDispatch] = useReducer(reducer, initialState);

  return { AuthState, AuthDispatch };
};

export default AuthReducer;
