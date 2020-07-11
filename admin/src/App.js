import React from "react";
import { HashRouter as Router } from "react-router-dom";
import Header from "./components/header";
import Routes from "./components/routes";
import { AuthProvider } from "./data/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App" style={{ backgroundColor: "grey", height: "980px" }}>
      <AuthProvider>
        <Router>
          <Header />
          <Routes />
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
