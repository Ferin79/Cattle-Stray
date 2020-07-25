import React, { useState, useEffect } from 'react'
import { Table, Col, Row, Button, Container, Form, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import firebase from "../../data/firebase";

export default function ManageOrganization() {
    const [isComponentLoading, setIsComponentLoading] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [organizations, setOrganizations] = useState([]);

    const addOrganization = (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const type = e.target.type.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

        console.log(name);
        console.log(type);
        console.log(email);
        console.log(password);



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


        fetch(
            "https://us-central1-cattle-stray.cloudfunctions.net/api/addOrganization",
            {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    accept: "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    type,
                }),
            }
        ).then((response) => {
            response.json().then((data) => {
                console.log(data);
                setIsComponentLoading(false);
                if (data.success) {
                    toast("Organization Added!");
                } else {
                    toast.error(data.error);
                }
            });
        });

    }

    useEffect(() => {
        firebase.firestore()
            .collection("users")
            .where("role", "==", "organization")
            .onSnapshot((docs) => {
                let org = [];
                docs.forEach((doc) => {
                    org.push({ ...doc.data(), id: doc.id });
                });
                setOrganizations(org);
                console.log(org);
            })
    }, [setOrganizations])

    let organizationRows;
    if (organizations.length > 0) {
        let count = 0
        organizationRows = organizations.map((org) => {
            return (
                <tr>
                    <td>{count++}</td>
                    <td>{org.name}</td>
                    <td>{org.type}</td>
                    <td>{org.email}</td>
                    <td> <Button variant="danger">Delete</Button> </td>
                </tr>
            )
        })
    }


    return (
        <Container>

            <Row>

                <Col>
                    <Table striped bordered hover variant="dark">
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
                            {organizationRows}
                        </tbody>
                    </Table>
                </Col>


                <Col>

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
    )
}
