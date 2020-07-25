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
        <Nav.Link>
          <NavLink to="/admin/organization" className="changeNavColor">
            Organization
          </NavLink>
        </Nav.Link>
        <Button
          onClick={() => firebase.auth().signOut()}
          variant="outline-danger"
        >
          Logout
        </Button>
      </>
    );
  } else if (currentUser) {
    navLinks = (
      <>
        <Nav.Link>
          <NavLink to="/dashboard" className="changeNavColor">
            Dashboard
          </NavLink>
        </Nav.Link>
        <Nav.Link>
          <NavLink to="/report" className="changeNavColor">
            Reports
          </NavLink>
        </Nav.Link>
        <Nav.Link>
          <NavLink to="/profile" className="changeNavColor">
            Profile
          </NavLink>
        </Nav.Link>
        <Button
          onClick={() => firebase.auth().signOut()}
          variant="outline-danger"
        >
          Logout
        </Button>
      </>
    );
  } else {
    navLinks = (
      <>
        <Nav.Link>
          <NavLink to="/login" className="changeNavColor">
            Login
          </NavLink>
        </Nav.Link>
        <Nav.Link>
          <NavLink to="/register" className="changeNavColor">
            Register
          </NavLink>
        </Nav.Link>
      </>
    );
  }

  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Navbar.Brand href="#home" className="changeNavColor">
        Cattle Stray {admin}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav center">
        <Nav className="mx-auto">{navLinks}</Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
