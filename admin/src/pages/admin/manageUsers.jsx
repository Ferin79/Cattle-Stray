import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [isComponentLoading, setIsComponentLoading] = useState(false);

  const history = useHistory();

  const fetchUsers = async () => {
    try {
      setIsComponentLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users`);
      const responseData = await response.json();

      if (responseData.success) {
        const data = responseData.data.users;
        setUsers([...data]);
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
    fetchUsers();
  }, []);
  return (
    <Container fluid>
      <Row className="m-5">
        <Col sm="12" md="12" lg="auto" xl="12">
          {isComponentLoading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <Table striped responsive bordered hover variant="dark">
              <thead>
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>email</th>
                  <th>Profile</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{++index}</td>
                      <td>{item.firstname}</td>
                      <td>{item.lastname}</td>
                      <td>{item.email}</td>
                      <td>
                        <Image
                          src={item.photoUrl}
                          height={150}
                          width={150}
                          rounded
                        />
                      </td>
                      <td>
                        <Button
                          className="ml-3"
                          variant="outline-info"
                          onClick={() => {
                            history.push(`/admin/user/${item.id}`);
                          }}
                        >
                          View More
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
};

export default ManageUsers;
