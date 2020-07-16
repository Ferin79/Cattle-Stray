import React from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import firebase from "../data/firebase";
import { ToastContainer, toast } from "react-toastify";

export default function Register() {
  const [errorText, setErrorText] = useState("");

  const onRegister = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const firstName = e.target.firstname.value;
    const lastName = e.target.lastname.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    console.log(firstName, lastName);
    
    if (email === "" || password === "" || confirmPassword === "") {
      setErrorText("Empty fields");
      return;
    }
    if (password !== confirmPassword) {
      setErrorText("Passwords don't match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password should not be less than 6 characters");
      return;
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)      
      .then((response) => {
        const email = response.user.email;
        const id = response.user.uid;
        firebase.firestore().collection("users").doc(id).set({
          role: "user",
          email,
          firstname: "",
          lastname: "",
          createdAt: firebase.firestore.Timestamp.now(),
        });
      })
      .catch((error) => {
        console.log(error);
        if (error.code === "auth/network-request-failed") {
          toast.error("Network connectivity issue");
        } else {
          toast.error(error.message);
        }
      });
  };
  return (
    <Container className="justify-content-md-center col-3">
      <h1>Register</h1>
      <Form onSubmit={(e) => onRegister(e)}>
        <Form.Group controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>
        <Row>
          <Col>
            <Form.Group controlId="firstname">
              <Form.Label>User Name</Form.Label>
              <Form.Control type="text" placeholder="First Name" />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="lastname">
              <Form.Label>User Name</Form.Label>
              <Form.Control type="text" placeholder="First Name" />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>

        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <div style={{ color: "red", margin: 5 }}>{errorText}</div>
        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
      <ToastContainer />
    </Container>
  );
}
