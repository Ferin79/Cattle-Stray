import React from "react";
import { HashRouter as Router } from "react-router-dom";
import Header from "./components/header";
import Routes from "./components/routes";
import { AuthProvider } from "./data/auth";
import { ContextProvider } from "./data/context";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

function App() {
  return (
    <div>
      <ContextProvider>
        <AuthProvider>
          <Router>
            <Header />
            <Routes />
          </Router>
        </AuthProvider>
      </ContextProvider>
    </div>
  );
}

export default App;
