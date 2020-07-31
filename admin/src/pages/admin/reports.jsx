import React, { useEffect, useContext, useState } from "react";
import firebase from "../../data/firebase";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Spinner from "react-bootstrap/Spinner";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  TrafficLayer,
} from "react-google-maps";
import { ToastContainer, toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import { Context } from "../../data/context";

export default function Reports() {
  const { reports, setReports } = useContext(Context);
  const [key, setKey] = useState("table");
  const [coordinates, setCoordinates] = useState({
    lat: 21.17024,
    lng: 72.831062,
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [isComponentLoading, setIsComponentLoading] = useState(true);

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

  const MyMapComponent = compose(
    // AIzaSyCe66OVhbLjhVls27VDc8jKACUM6AyHNx8
    withProps({
      googleMapURL:
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyDgxTYG7n4gf5qpLdeA_pC_RcTQAc7wdWk&v=3.exp&libraries=geometry,drawing,places",
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `800px` }} />,
      mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
  )((props) => (
    <>
      <GoogleMap
        defaultCenter={{ lat: -34.397, lng: 150.644 }}
        center={coordinates}
        zoom={15}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
        onClick={(event) => console.log(event)}
      >
        {props.markerCoords.map((item) => {
          let url = require("../../images/location-pin.svg");
          url =
            item.animalType === "cow" ? require("../../images/cow.svg") : url;
          url =
            item.animalType === "buffalo"
              ? require("../../images/buffalo.svg")
              : url;
          url =
            item.animalType === "goat" ? require("../../images/goat.svg") : url;
          return (
            <Marker
              icon={{
                url,
                scaledSize: new window.google.maps.Size(50, 50),
              }}
              position={{
                lat: item.animalMovingCoords.Va,
                lng: item.animalMovingCoords.ga,
              }}
              onClick={() => setSelectedItem(item)}
            />
          );
        })}
        <TrafficLayer autoUpdate />
      </GoogleMap>
    </>
  ));

  useEffect(() => {
    setIsComponentLoading(true);
    firebase
      .firestore()
      .collection("reports")
      .where("isRejected", "==", false)
      .where("isResolved", "==", false)
      .orderBy("createdAt", "desc")
      .onSnapshot((docs) => {
        let reports = [];
        docs.forEach((doc) => {
          reports.push({ ...doc.data(), id: doc.id });
        });
        setReports(reports);
        setIsComponentLoading(false);
      });
  }, [setReports]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          toast.error("error");
          console.log(error);
        },
        { timeout: 10000 }
      );
    } else {
      toast.error("Function not supported");
    }
  }, []);

  return (
    <Container fluid>
      <div className="d-flex flex-row justify-content-space-evenly align-items-center mt-5">
        <h3>Admin Reports</h3>

        <Tabs
          style={{ marginLeft: 50 }}
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => {
            setSelectedItem(null);
            setKey(k);
          }}
        >
          <Tab eventKey="table" title="Table"></Tab>
          <Tab eventKey="map" title="Map"></Tab>
        </Tabs>
      </div>

      {key === "table" && (
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
                  {reports.length &&
                    reports.map((report, index) => {
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
                          <td>{report.createdAt.toDate().toLocaleString()}</td>
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
      )}

      {key === "map" && (
        <Row className="d-flex justify-content-center align-items-center mt-5 mb-5">
          <Col lg={true}>
            <MyMapComponent markerCoords={reports} />
          </Col>
        </Row>
      )}

      {selectedItem && (
        <Row className="d-flex justify-content-center align-items-center mt-5 mb-5">
          <Col lg={true}>
            <Card style={{ width: 500 }}>
              <Card.Header as="h5">Report Detail</Card.Header>
              <Card.Img
                variant="top"
                src={selectedItem.animalImageUrl}
                height={250}
                width={250}
              />
              <Card.Body>
                <Card.Title style={{ textTransform: "capitalize" }}>
                  {selectedItem.animalType}
                </Card.Title>
                <Card.Text>
                  Last Seen: {selectedItem.createdAt.toDate().toLocaleString()}
                </Card.Text>
                <Card.Body>
                  <Card.Subtitle className="mb-2 text-muted">
                    Animal Count: {selectedItem.animalCount}
                  </Card.Subtitle>
                  <Card.Text>{selectedItem.description}</Card.Text>
                  <Card.Text>
                    was Animal Moving? {selectedItem.animalIsMoving}
                  </Card.Text>
                  <div className="d-flex flex-row flex-wrap justify-content-space-evenly align-items-center">
                    <Row style={{ margin: 4 }}>
                      <Button variant="outline-info">
                        <NavLink to={`/admin/report/${selectedItem.id}`}>
                          View More
                        </NavLink>
                      </Button>
                    </Row>
                    <Row style={{ margin: 4 }}>
                      {selectedItem.isUnderProcess ? (
                        <Button variant="outline-success" disabled>
                          Processing
                        </Button>
                      ) : (
                        <Button
                          variant="outline-success"
                          onClick={() =>
                            handleReportReject(
                              selectedItem.uid,
                              "underProcess",
                              selectedItem.id
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
                            selectedItem.uid,
                            "rejected",
                            selectedItem.id
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
                            selectedItem.uid,
                            "resolved",
                            selectedItem.id
                          )
                        }
                      >
                        Resolve
                      </Button>
                    </Row>
                  </div>
                </Card.Body>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      <ToastContainer />
    </Container>
  );
}
