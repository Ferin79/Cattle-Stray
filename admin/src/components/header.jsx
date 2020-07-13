import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Nav, Navbar, Button } from "react-bootstrap";
import { AuthContext } from "../data/auth";
import { Context } from "../data/context";
import firebase from "../data/firebase";

const Header = () => {
  const { currentUser } = useContext(AuthContext);  
  const { role } = useContext(Context);

  let navLinks;
  let admin = "";
  if (currentUser && role === "admin") {
    admin = "Admin";
    navLinks = (
      <>
        <Nav.Link>
          <NavLink to="/admin/dashboard" className="changeNavColor">
          Dashboard
          </NavLink>
        </Nav.Link>
        <Nav.Link>
          <NavLink to="/admin/reports" className="changeNavColor">
          Reports
          </NavLink>
        </Nav.Link>
          <Button onClick={() => firebase.auth().signOut()} variant="outline-danger">
            Logout
          </Button>
      </>
    );
  }
  else if (currentUser) {
    navLinks = (
      <>
        <Nav.Link>
          <NavLink to="/dashboard" className="changeNavColor">
          Dashboard
          </NavLink>
        </Nav.Link>
        <Nav.Link>
          <NavLink to="/reports" className="changeNavColor">
          Reports
          </NavLink>
        </Nav.Link>
          <Button onClick={() => firebase.auth().signOut()} variant="outline-danger">
            Logout
          </Button>
      </>
    );
  } else {
    navLinks = (
      <>
        <NavLink to="/login">
        <Button variant="outline-primary" className="changeNavButtonColor">Login</Button>
        </NavLink>
        <NavLink to="/register">
        <Button variant="outline-success" className="changeNavButtonColor">Register</Button>
        </NavLink>
      </>
    );
  }

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#home">Cattle Stray {admin}</Navbar.Brand>
      <Nav className="mr-auto">
        {navLinks}
      </Nav>
    </Navbar>
  );
};

export default Header;
