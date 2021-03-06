import React, { useEffect, useState, useRef } from "react";
import { compose, withProps } from "recompose";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import { animateScroll } from "react-scroll";
import firebase from "../../data/firebase";
import ReportDescriptionModal from "../../components/reportDescriptionModal";

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const MyMapComponent = compose(
  // AIzaSyCe66OVhbLjhVls27VDc8jKACUM6AyHNx8
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDgxTYG7n4gf5qpLdeA_pC_RcTQAc7wdWk&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%`, width: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) => (
  <>
    <GoogleMap
      defaultCenter={{ lat: -34.397, lng: 150.644 }}
      center={props.markerCoords}
      zoom={props.markerCoords ? 16 : 8}
      options={options}
      onClick={(event) => console.log(event)}
    >
      {props.markerCoords && (
        <Marker
          icon={{ colour: "blue" }}
          position={{
            lat: props.markerCoords.lat,
            lng: props.markerCoords.lng,
          }}
          onClick={props.onMarkerClick}
        />
      )}
    </GoogleMap>
  </>
));

export default function ReportDetails({ match }) {
  const [report, setReport] = useState([]);
  const [coordinates, setCoordinates] = useState({
    lat: 21.17024,
    lng: 72.831062,
  });
  const [isMarkerShown, setIsMarkerShown] = useState(false);
  const [message, setMessage] = useState("");
  const [isMessageSending, setIsMessageSending] = useState(false);

  const [modalShow, setModalShow] = React.useState(false);
  const [modalData, setModalData] = useState({});
  const [modalLoading, setModalLoading] = useState(false);

  const commentBoxRef = useRef();

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

  const handleReportReject = (id, type, docId, description = "") => {
    if (type === "rejected" || type === "resolved") {
      setModalLoading(true);
    }
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
                  actionDescription: {
                    description,
                    name: firebase.auth().currentUser.displayName,
                    uid: firebase.auth().currentUser.uid,
                    createdAt: firebase.firestore.Timestamp.now(),
                  },
                })
                .then(() => {
                  firebase
                    .firestore()
                    .doc(`/users/${id}`)
                    .update({
                      points: firebase.firestore.FieldValue.increment(-10),
                    })
                    .then(() => {
                      setModalShow(false);
                      setModalLoading(true);
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
                  actionDescription: {
                    description,
                    name: firebase.auth().currentUser.displayName,
                    uid: firebase.auth().currentUser.uid,
                    createdAt: firebase.firestore.Timestamp.now(),
                  },
                })
                .then(() => {
                  firebase
                    .firestore()
                    .doc(`/users/${id}`)
                    .update({
                      points: firebase.firestore.FieldValue.increment(20),
                    })
                    .then(() => {
                      setModalShow(false);
                      setModalLoading(true);
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

  const submitComent = (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      alert("Message cannot be empty");
      return;
    }
    setIsMessageSending(true);
    firebase
      .firestore()
      .doc(`/reports/${report.id}`)
      .get()
      .then((doc) => {
        const comments = doc.data().comments;
        comments.push({
          userId: firebase.auth().currentUser.uid,
          message: message,
          createdAt: firebase.firestore.Timestamp.now(),
          photoUrl: firebase.auth().currentUser.photoURL,
        });
        firebase
          .firestore()
          .doc(`/reports/${report.id}`)
          .update({
            comments: comments,
          })
          .then(() => {
            animateScroll.scrollToBottom({
              containerId: "commentBox",
            });
            setMessage("");
          });
      })
      .catch((error) => {
        console.log()(error.message);
        alert("Adding Comment Failed");
      })
      .finally(() => {
        setIsMessageSending(false);
      });
  };

  useEffect(() => {
    firebase
      .firestore()
      .collection("reports")
      .doc(match.params.reportId)
      .onSnapshot((doc) => {
        const lat = doc.data().coordinates.latitude;
        const lng = doc.data().coordinates.longitude;
        setReport({ ...doc.data(), id: doc.id });
        setCoordinates({ lat, lng });
        showMarker();
        animateScroll.scrollToBottom({
          containerId: "commentBox",
        });
      });
  }, [match.params.reportId]);

  const handleMarkerClick = () => {
    setIsMarkerShown(false);
    showMarker();
  };
  const showMarker = () => {
    setTimeout(() => {
      setIsMarkerShown(true);
    }, 500);
  };

  let animalType,
    animalIsMoving,
    animalCondition,
    animalCount,
    description,
    upvotes,
    downvotes,
    image,
    comments = [],
    actionDescription;

  let injuredStyle = {};

  if (report.uid) {
    image = report.animalImageUrl;
    animalType = report.animalType;
    animalCondition = report.animalCondition;
    animalCount = report.animalCount;
    animalIsMoving = report.animalIsMoving ? "Moving" : "Stable";
    description = report.description;
    upvotes = report.upvotes.length;
    downvotes = report.downvotes.length;
    comments = report.comments;
    actionDescription = report.actionDescription;
    if (
      animalCondition === "injured" ||
      animalCondition === "death" ||
      animalCondition === "Injured" ||
      animalCondition === "Death"
    ) {
      injuredStyle = { color: "red" };
    }
  }

  let Button_processRequest = (
    <Button
      variant="outline-success"
      disabled={report.isUnderProcess ? true : false}
      onClick={() => {
        handleReportReject(report.uid, "underProcess", report.id);
      }}
      style={buttonStyles}
      // eslint-disable-next-line
      disabled={report.isUnderProcess}
    >
      Process Request
    </Button>
  );

  let Button_rejectRequest = (
    <Button
      variant="outline-danger"
      onClick={() => {
        setModalData({
          uid: report.uid,
          type: "rejected",
          rid: report.id,
        });
        setModalShow(true);
      }}
      style={buttonStyles}
    >
      Reject
    </Button>
  );

  let Button_resolvedRequest = (
    <Button
      variant="outline-info"
      onClick={() => {
        setModalData({
          uid: report.uid,
          type: "resolved",
          rid: report.id,
        });
        setModalShow(true);
      }}
      style={buttonStyles}
    >
      Resolve
    </Button>
  );
  return (
    <Container fluid>
      <ReportDescriptionModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        data={modalData}
        handleReportReject={handleReportReject}
        loading={modalLoading}
      />
      <Row className="mt-5 mb-5">
        <Col sm="12" md="12" lg="8" xl="8">
          <Card>
            <Card.Header as="h2">Report Details</Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <p>
                  Report date :{" "}
                  {report.createdAt
                    ? report.createdAt.toDate().toLocaleString()
                    : ""}
                </p>
                <div md="auto">
                  {Button_processRequest}
                  {Button_resolvedRequest}
                  {Button_rejectRequest}
                </div>
              </div>

              <h5> Animal : {animalType}</h5>
              <h5 style={injuredStyle}> Condition : {animalCondition}</h5>

              <h4 className="mt-5">Report Location</h4>
              <MyMapComponent
                isMarkerShown={isMarkerShown}
                onMarkerClick={handleMarkerClick}
                markerCoords={coordinates}
              />
              <Row xs={2} md={4} lg={9} className="mt-3 mb-3">
                <Col>
                  <h6 className="upvotes"> Upvotes : {upvotes}</h6>
                </Col>
                <Col>
                  <h6 className="downvotes"> Downvotes : {downvotes}</h6>
                </Col>
              </Row>
              <h5> Approx number of animals : {animalCount}</h5>
              <h5> Status : {animalIsMoving}</h5>
              {description && <h5> Description : {description}</h5>}
              {actionDescription && (
                <h5> Action Description : {actionDescription.description}</h5>
              )}
              <a href={image}>
                <Image src={image} height={500} width={500} className="mt-3" />
              </a>
            </Card.Body>
          </Card>
        </Col>

        <Col sm="12" md="12" lg="4" xl="4">
          <Card>
            <div
              ref={commentBoxRef}
              id="commentBox"
              style={{
                maxHeight: 500,
                overflowY: "scroll",
              }}
            >
              {comments.length > 0 &&
                comments.map((comment, index) => {
                  return (
                    <div
                      className="d-flex border-bottom p-3 align-items-center"
                      key={index}
                    >
                      <Image
                        height={50}
                        width={50}
                        src={comment.photoUrl}
                        roundedCircle
                      />
                      <div className="ml-5">
                        <h5>
                          <b>User name</b>
                        </h5>
                        <h5>{comment.message}</h5>
                        <p>
                          <small>
                            {comment.createdAt.toDate().toLocaleString()}
                          </small>
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Card>
          <Form className="d-flex justify-content-between align-items-center">
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Message</Form.Label>
              <Form.Control
                type="test"
                placeholder="Type Message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </Form.Group>
            {isMessageSending ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              <Button
                variant="primary"
                type="submit"
                onClick={(event) => {
                  submitComent(event);
                }}
              >
                Send
              </Button>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

const buttonStyles = {
  marginLeft: 8,
};
