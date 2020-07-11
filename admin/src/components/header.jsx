import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Nav, Navbar, Button } from "react-bootstrap";
import { AuthContext } from "../data/auth";
import firebase from "../data/firebase";


const Header = () => {

  const { currentUser } = useContext(AuthContext);

  let navLinks;
  if (currentUser) {
    navLinks = (
      <>
       <Nav.Link>
            <NavLink to="/dashboard" className="changeNavColor">Dashboard</NavLink>    
        </Nav.Link>        
        <Nav.Link>
            <NavLink to="/reports" className="changeNavColor">Reports</NavLink>
        </Nav.Link>
        <Nav.Link>
            <Button onClick={() => firebase.auth().signOut()} variant="outline-danger">Logout</Button>
        </Nav.Link>
      </>
    ); 
  } else {
    navLinks = (
      <>
       <Nav.Link>
          <Button variant="outline-primary">
            <NavLink to="/login" className="changeNavButtonColor">Login</NavLink>
          </Button>            
        </Nav.Link>        
        <Nav.Link>
          <Button variant="outline-success">
            <NavLink to="/register" className="changeNavButtonColor">Register</NavLink>
          </Button>
        </Nav.Link>
      </>
    );
  }

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#home">Cattle Stray</Navbar.Brand>              
      <Nav className="mr-auto">
       {navLinks}        
      </Nav>          
    </Navbar>
  );
}

export default Header;