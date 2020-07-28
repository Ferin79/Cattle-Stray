import React, { useState, useEffect } from "react";
import {
  Table,
  Col,
  Row,
  Button,
  Container,
  Form,
  Spinner,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import firebase from "../../data/firebase";

export default function ManageOrganization() {
  const [isComponentLoading, setIsComponentLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [errorText, setErrorText] = useState("");
  const [organizations, setOrganizations] = useState([]);

  const deleteOrganization = async (id) => {
    setDeleteLoadingId(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/organization/delete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            organizationId: id,
            authUserId: firebase.auth().currentUser.uid,
          }),
        }
      );
      const responseData = await response.json();

      if (responseData.success) {
        toast("Organization Deleted Successfully");
      } else {
        toast.error(responseData.error);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setDeleteLoadingId(false);
    }
  };

  const addOrganization = async (e) => {
    e.preventDefault();

    try {
      setIsComponentLoading(true);
      const name = e.target.name.value;
      const type = e.target.type.value;
      const email = e.target.email.value;
      const password = e.target.password.value;

      if (
        email.trim() === "" ||
        password.trim() === "" ||
        name.trim() === "" ||
        type.trim() === "Select"
      ) {
        setErrorText("Empty fields");
        return;
      }
      if (password.length < 6) {
        setErrorText("Password should not be less than 6 characters");
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/organization/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email,
            name,
            password,
            type,
            authUserId: firebase.auth().currentUser.uid,
          }),
        }
      );

      const responseData = await response.json();

      if (responseData.success) {
        toast("Organization Added Successfully");
      } else {
        toast.error(responseData.error);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsComponentLoading(false);
    }
  };

  useEffect(() => {
    firebase
      .firestore()
      .collection("organizations")
      .where("role", "==", "organization")
      .onSnapshot((docs) => {
        let org = [];
        docs.forEach((doc) => {
          org.push({ ...doc.data(), id: doc.id });
        });
        setOrganizations(org);
      });
  }, [setOrganizations]);

  return (
    <Container fluid>
      <Row className="m-5">
        <Col sm="12" md="6" lg="6">
          <Table striped bordered hover responsive variant="dark">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Type</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {organizations.length &&
                organizations.map((org, index) => {
                  return (
                    <tr>
                      <td>{++index}</td>
                      <td>{org.name}</td>
                      <td>{org.type}</td>
                      <td>{org.email}</td>
                      <td>
                        {deleteLoadingId === org.id ? (
                          <Spinner animation="border" variant="primary" />
                        ) : (
                          <Button
                            variant="outline-danger"
                            onClick={() => {
                              deleteOrganization(org.id);
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </Col>

        <Col sm="12" md="6" lg="6">
          <h1 className="mb-5">Add Organization</h1>
          <Form onSubmit={(e) => addOrganization(e)}>
            <Form.Group controlId="name">
              <Form.Label>Organization Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" />
            </Form.Group>

            <Form.Group controlId="type">
              <Form.Label>Type</Form.Label>
              <Form.Control as="select" required>
                <option>Select</option>
                <option>Type 1</option>
                <option>Type 2</option>
                <option>Type 3</option>
              </Form.Control>
            </Form.Group>

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
