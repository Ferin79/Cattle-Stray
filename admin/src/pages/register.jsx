import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import firebase from "../data/firebase";
import { ToastContainer, toast } from "react-toastify";

export default function Register() {
  const [errorText, setErrorText] = useState("");
  const [isComponentLoading, setIsComponentLoading] = useState(false);

  const onRegister = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const firstName = e.target.firstname.value;
    const lastName = e.target.lastname.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (
      email.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === "" ||
      firstName.trim() === "" ||
      lastName.trim() === ""
    ) {
      setErrorText("Empty fields");
      return;
    }
    if (password.length < 6) {
      setErrorText("Password should not be less than 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setErrorText("Passwords don't match");
      return;
    }
    setIsComponentLoading(true);

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
        setErrorText(error.message);
        if (error.code === "auth/network-request-failed") {
          toast.error("Network connectivity issue");
        } else {
          toast.error(error.message);
        }
      })
      .finally(() => {
        setIsComponentLoading(false);
      });
  };
  return (
    <Container fluid>
      <Row className="d-flex justify-content-center align-items-center mt-5">
        <Col xl="4" sm="12" md="4" lg={true}>
          <h1 className="center mb-5">Register</h1>
          <Form onSubmit={(e) => onRegister(e)}>
            <Form.Group controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Eg: jeo@example.com" />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group controlId="firstname">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" placeholder="Eg: Jeo" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="lastname">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" placeholder="Eg: Deo" />
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
            <div className="text-danger mt-3 mb-3">{errorText}</div>
            {isComponentLoading ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              <Button variant="primary" type="submit">
                Register
              </Button>
            )}
          </Form>
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
}
