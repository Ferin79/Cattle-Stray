import React, { useEffect, useContext, useState, useCallback } from "react";
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
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
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

const compareReports = (report_1, report_2) => {
  if (report_1.reportType !== report_2.reportType) {
    if (report_1.reportType === "health") {
      return -1;
    } else if (report_2.reportType === "health") {
      return 1;
    }
  }
  return 0;
};
// Modal
function MyVerticallyCenteredModal(props) {  
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          How was this report resolved ?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e) => {
          e.preventDefault();
          const uid = props.data.uid
          const type = props.data.type
          const rid = props.data.rid
          const description = e.target.description.value                    
          props.handleReportReject(uid, type, rid);
        }}>
          <Form.Group controlId="description">          
            <Form.Control  as="textarea" rows="3" type="description" placeholder="Enter description" />            
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
          <Button variant="danger" onClick={props.onHide} style={{marginLeft: 5}}>Close</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default function Reports() {
  const { reports, setReports } = useContext(Context);
  const [key, setKey] = useState("table");
  const [coordinates, setCoordinates] = useState({
    lat: 21.17024,
    lng: 72.831062,
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [isComponentLoading, setIsComponentLoading] = useState(true);
  const [modalShow, setModalShow] = React.useState(false);
  const [modalData, setModalData] = useState({})

  const sendNotification = async (token, title, description) => {
    try {
      const message = {
        to: [token],
        sound: "default",
        title: title,
        body: description,
      };
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        body: JSON.stringify(message),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleReportReject = (id, type, docId, description="") => {        
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
                  actionDescription: description, 
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
              notificationDesc = `Your report with ID: ${docId} has been approved and 20 points has been added`;
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
    withProps({
      googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_PLACES}&v=3.exp&libraries=geometry,drawing,places`,
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

  // eslint-disable-next-line
  const fetchReports = useCallback(async () => {
    try {
      setIsComponentLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reports`);
      const responseData = await response.json();

      if (responseData.success) {
        if (responseData.data.count > 0) {
          const reports = responseData.data.reports.sort(compareReports);
          setReports([...reports]);
        }
      } else {
        alert(responseData.error);
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    } finally {
      setIsComponentLoading(false);
    }
  }, [setReports]);

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
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        data={modalData}        
        handleReportReject={handleReportReject}
      />
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
                      <th>Type</th>
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
                            <td>{report.reportType}</td>
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
                                  onClick={
                                    () => {
                                      setModalData({
                                        uid: report.uid,
                                        type: "resolved",
                                        rid: report.id
                                      })
                                      setModalShow(true)
                                      // handleReportReject(
                                      //   report.uid,
                                      //   "resolved",
                                      //   report.id
                                      // )
                                    }
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
