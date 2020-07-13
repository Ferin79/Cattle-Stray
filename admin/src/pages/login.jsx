import React from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useState } from "react";
import firebase from "../data/firebase";
import { ToastContainer, toast } from 'react-toastify';

export default function Login() {
  const [errorText, setErrorText] = useState('');

  const onRegister = (e) => {
    e.preventDefault();
    const email = e.target.email.value; 
    const password = e.target.password.value; 
    if (email === "" || password === "") {
      setErrorText("Empty fields"); return;
    }
    if (password.length < 6) {
      setErrorText("Invalid Password"); return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
      console.log(error);
      if (error.code === "auth/network-request-failed") {
        toast.error("Network connectivity issue");
      }else if(error.code === "auth/user-not-found"){
        toast.error("User not found");
      }else{
        toast.error(error.message);
      }      
    });

  }
  return (
    <Container className="justify-content-md-center col-3">
      <h1>Login</h1>
      <Form onSubmit={(e) => onRegister(e)}>
        <Form.Group controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />          
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
              
        <div style={{color:"red", margin:5}}>{errorText}</div>
        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
      <ToastContainer />
    </Container>
  );
}
