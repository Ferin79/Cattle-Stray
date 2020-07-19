import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import firebase from "../data/firebase";
import { ToastContainer, toast } from "react-toastify";

export default function Login() {
  const [errorText, setErrorText] = useState("");
  const [isComponentLoading, setIsComponentLoading] = useState(false);

  const onRegister = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    if (email.trim() === "" || password.trim() === "") {
      setErrorText("Empty fields");
      return;
    }
    if (password.length < 6) {
      setErrorText("Invalid Password");
      return;
    }
    setIsComponentLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        setErrorText(error.message);
        if (error.code === "auth/network-request-failed") {
          toast.error("Network connectivity issue");
        } else if (error.code === "auth/user-not-found") {
          toast.error("User not found");
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
          <h1 className="mb-5">Login</h1>
          <Form onSubmit={(e) => onRegister(e)}>
            <Form.Group controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>

            <div className="text-danger mt-3 mb-3">{errorText}</div>
            {isComponentLoading ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              <Button variant="primary" type="submit">
                Login
              </Button>
            )}
          </Form>
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
}
