import React, { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Image from "react-bootstrap/Image";
import Spinner from "react-bootstrap/Spinner";
import { NavLink } from "react-router-dom";
import firebase from "../../data/firebase";

const UserDetails = ({ match }) => {
  const { id } = match.params;

  const [userReports, setUserReports] = useState([]);
  const [isComponentLoading, setIsComponentLoading] = useState(true);

  const fetchUsersById = useCallback(async () => {
    try {
      setIsComponentLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/reports/user/${id}`
      );

      const responseData = await response.json();
      if (responseData.success) {
        const reports = responseData.data.reports;
        setUserReports([...reports]);
      } else {
        toast.error(responseData.error);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsComponentLoading(false);
    }
  }, [id]);

  const handleReportReject = (id, type, docId) => {
    try {
      firebase
        .firestore()
        .collection("notificationTokens")
        .where("uid", "==", id)
        .get()
        .then((docs) => {
          if (!docs.empty) {
            let token = "";
            docs.forEach((doc) => {
              token = doc.data().token;
            });

            let notificationDesc = "";
            if (type === "rejected") {
              firebase
                .firestore()
                .doc(`/reports/${docId}`)
                .update({
                  isUnderProcess: false,
                  isRejected: true,
                })
                .then(() => {
                  firebase
                    .firestore()
                    .doc(`/users/${id}`)
                    .update({
                      points: firebase.firestore.FieldValue.increment(-10),
                    });
                })
                .catch((error) => console.log(error));
              notificationDesc = `Your report with ID: ${docId} has been rejected and 10 Points has been deducted`;
            } else if (type === "resolved") {
              firebase
                .firestore()
                .doc(`/reports/${docId}`)
                .update({
                  isUnderProcess: false,
                  isResolved: true,
                })
                .then(() => {
                  firebase
                    .firestore()
                    .doc(`/users/${id}`)
                    .update({
                      points: firebase.firestore.FieldValue.increment(20),
                    });
                })
                .catch((error) => console.log(error));
              notificationDesc = `Your report with ID: ${docId} has been approved ans 20 points has been added`;
            } else if (type === "underProcess") {
              firebase
                .firestore()
                .doc(`/reports/${docId}`)
                .update({
                  isUnderProcess: true,
                })
                .catch((error) => console.log(error));
              notificationDesc = `Your report with ID: ${docId} is in under process`;
            }

            if (notificationDesc.trim() !== "") {
              sendNotification(token, "Report Status", notificationDesc);
            }
          }
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };

  const sendNotification = async (token, title, description) => {
    try {
      const message = {
        to: [token],
        sound: "default",
        title: title,
        body: description,
      };
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        body: JSON.stringify(message),
      });
      const responseDate = await response.json();
      console.log(responseDate);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsersById();
  }, [fetchUsersById]);
  return (
    <Container fluid>
      <Row className="d-flex justify-content-center align-items-center mt-5 mb-5">
        <Col lg={true}>
          {isComponentLoading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <Table striped bordered hover responsive variant="dark">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Report Type</th>
                  <th>Image</th>
                  <th>Time</th>
                  <th>Animal</th>
                  <th>Condition</th>
                  <th>Count</th>
                  <th>Moving</th>
                  <th>Description</th>
                  <th>GI Number</th>
                  <th>Up Votes</th>
                  <th>Down Votes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userReports.length &&
                  userReports.map((report, index) => {
                    let injuredStyle = {};
                    if (
                      report.animalCondition === "injured" ||
                      report.animalCondition === "death" ||
                      report.animalCondition === "Injured" ||
                      report.animalCondition === "Death"
                    ) {
                      injuredStyle = { color: "red" };
                    }
                    return (
                      <tr key={index}>
                        <td>{++index}</td>
                        <th>{report.reportType}</th>
                        <td>
                          <Image
                            height="150px"
                            width="150px"
                            src={report.animalImageUrl}
                            rounded
                          />
                        </td>
                        <td>{report.createdAt}</td>
                        <td>{report.animalType}</td>
                        <td style={injuredStyle}>{report.animalCondition}</td>
                        <td>{report.animalCount}</td>
                        <td>{report.animalIsMoving}</td>
                        <td>{report.description}</td>
                        <th>{report.animalGI}</th>
                        <td>{report.upvotes.length}</td>
                        <td>{report.downvotes.length}</td>
                        <td className="d-flex flex-row flex-wrap justify-content-space-evenly align-items-center">
                          <Row style={{ margin: 4 }}>
                            <Button variant="outline-info">
                              <NavLink
                                to={`/admin/report/${report.id}`}
                                className="changeNavColor"
                              >
                                View
                              </NavLink>
                            </Button>
                          </Row>
                          <Row style={{ margin: 4 }}>
                            {report.isUnderProcess ? (
                              <Button variant="outline-success" disabled>
                                Processing
                              </Button>
                            ) : (
                              <Button
                                variant="outline-success"
                                onClick={() =>
                                  handleReportReject(
                                    report.uid,
                                    "underProcess",
                                    report.id
                                  )
                                }
                              >
                                Process request
                              </Button>
                            )}
                          </Row>
                          <Row style={{ margin: 4 }}>
                            <Button
                              variant="outline-danger"
                              onClick={() =>
                                handleReportReject(
                                  report.uid,
                                  "rejected",
                                  report.id
                                )
                              }
                            >
                              Reject
                            </Button>
                          </Row>
                          <Row style={{ margin: 4 }}>
                            <Button
                              variant="outline-primary"
                              onClick={() =>
                                handleReportReject(
                                  report.uid,
                                  "resolved",
                                  report.id
                                )
                              }
                            >
                              Resolve
                            </Button>
                          </Row>
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

export default UserDetails;
