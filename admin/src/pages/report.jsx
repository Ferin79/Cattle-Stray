import React, { useState, useEffect, useContext } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProgressBar from "react-bootstrap/ProgressBar";
import { ToastContainer, toast } from "react-toastify";
import * as geofirestore from "geofirestore";
import { Context } from "../data/context";
import firebase from "../data/firebase";
import Loading from "../components/LoadingScreen";

const mapContainerStyle = {
  width: "100%",
  height: "90vh",
};

const defaultcenter = { lat: 21.1702, lng: 72.8311 };

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const cowAudio = new Audio(require("../audio/Cow.mp3"));
const goatAudio = new Audio(require("../audio/Goat.mp3"));

export default function Reports() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDgxTYG7n4gf5qpLdeA_pC_RcTQAc7wdWk",
  });

  const { isLoading, setIsLoading } = useContext(Context);

  const [cattleLocation, setCattleLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [animalType, setAnimalType] = useState(null);
  const [errorText, setErrorText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [percentage, setPercentage] = useState(0);

  const playAudio = () => {
    if (animalType === "Cow" || animalType === "Buffalo") {
      cowAudio.load();
      cowAudio.play();
    } else if (animalType === "Goat") {
      goatAudio.load();
      goatAudio.play();
    }
  };

  const onMapClick = (event) => {
    setCattleLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
    playAudio();
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    const animalCondition = e.target.animalCondition.value.toLowerCase();
    const animalCount = e.target.animalCount.value;
    const animalIsMoving = e.target.animalIsMoving.checked;
    const animalType = e.target.animalType.value;
    const description = e.target.description.value.toLowerCase();
    if (animalCondition === "Select") {
      setErrorText("Select animal condition");
      return;
    }
    if (animalCount < 0 || animalCount > 60) {
      setErrorText("Enter valid animal count");
      return;
    }
    if (!selectedFile) {
      setErrorText("Select image");
      return;
    }
    if (animalType === "Select") {
      setErrorText("Select animal type");
      return;
    }
    if (description === "") {
      setErrorText("Enter description");
      return;
    }
    if (!cattleLocation) {
      setErrorText("Select cattle location");
      return;
    }
    // if (!userLocation) {
    //     setErrorText("Provide user location"); return
    // }
    setIsLoading(true);
    const storageRef = firebase.storage().ref(`reports/${Date.now()}`);
    var uploadTask = storageRef.put(selectedFile);
    uploadTask.on(
      "state_changed",
      function (snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setPercentage(Math.round(parseInt(progress)));
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING:
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      function (error) {
        setIsLoading(false);
        setErrorText(error.message);
        console.log(error);
      },
      function () {
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log("File available at", downloadURL);

          const firestore = firebase.firestore();
          const GeoFirestore = geofirestore.initializeApp(firestore);
          const geocollection = GeoFirestore.collection("reports");
          geocollection
            .add({
              animalType,
              animalCondition,
              animalCount,
              animalIsMoving,
              animalImageUrl: downloadURL,
              animalMovingCoords: new firebase.firestore.GeoPoint(
                cattleLocation.lat,
                cattleLocation.lng
              ),
              coordinates: new firebase.firestore.GeoPoint(
                cattleLocation.lat,
                cattleLocation.lng
              ),
              userCoords: new firebase.firestore.GeoPoint(
                userLocation.lat,
                userLocation.lng
              ),
              description,
              upvotes: [],
              downvotes: [],
              comments: [],
              isUnderProcess: false,
              isResolved: false,
              isRejected: false,
              uid: firebase.auth().currentUser.uid,
              email: firebase.auth().currentUser.email,
              createdAt: firebase.firestore.Timestamp.now(),
            })
            .then(() => {
              toast("Report Submitted Successfully");
            })
            .catch((error) => {
              toast.error(error.message);
            })
            .finally(() => {
              setCattleLocation(null);
              setIsLoading(false);
            });
        });
      }
    );
  };

  const RenderCattleMarker = () => {
    let url = require("../images/location-pin.svg");
    url = animalType === "Cow" ? require("../images/cow.svg") : url;
    url = animalType === "Buffalo" ? require("../images/buffalo.svg") : url;
    url = animalType === "Goat" ? require("../images/goat.svg") : url;
    console.log("here " + url);
    return (
      <Marker
        icon={{
          url,
          scaledSize: new window.google.maps.Size(30, 30),
        }}
        position={cattleLocation}
      />
    );
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCattleLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          toast.error(error.message);
          console.log(error);
        },
        { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      toast.error("Function not supported");
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          setUserLocation({
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
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  if (loadError) return "Error Loading maps";

  if (!isLoaded) return <Loading text="Loading" />;

  if (isLoading)
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h3>Uploading Report, Please Wait</h3>
        <ProgressBar
          className="mt-5"
          style={{ width: "50%" }}
          now={percentage}
          label={`${percentage}%`}
        />
      </div>
    );

  return (
    <Container>
      <Row className="d-flex justify-content-center align-items-center mt-5 mb-5">
        <Col lg={true}>
          <h1 className="mb-5">New Report</h1>
          <Form onSubmit={(e) => onFormSubmit(e)}>
            <Form.Group controlId="animalType">
              <Form.Label>Animal Type</Form.Label>
              <Form.Control
                as="select"
                required
                onChange={(e) => setAnimalType(e.target.value.toLowerCase)}
              >
                <option>Select</option>
                <option>Cow</option>
                <option>Buffalo</option>
                <option>Goat</option>
                <option>Other</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="animalCondition">
              <Form.Label>Animal Condition</Form.Label>
              <Form.Control as="select" required>
                <option>Select</option>
                <option>Death</option>
                <option>Injured</option>
                <option>Normal</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="animalCount">
              <Form.Label>Animal Count</Form.Label>
              <Form.Control
                min="1"
                required
                type="number"
                placeholder="Approximate animal count"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Select Image</Form.Label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(event) => {
                  if (
                    event.target.files[0] &&
                    (event.target.files[0].type === "image/jpeg" ||
                      event.target.files[0].type === "image/png" ||
                      event.target.files[0].type === "image/jpg" ||
                      event.target.files[0].type === "image/gif")
                  ) {
                    setSelectedFile(event.target.files[0]);
                  } else {
                    alert("Please Select Valid Image File");
                    setSelectedFile(null);
                  }
                }}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Status</Form.Label>

              <Form.Check
                type="checkbox"
                label="was Moving ?"
                name="animalIsMoving"
                id="animalMoving1"
              />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows="3" />
            </Form.Group>

            <Form.Group>
              <Form.Row className="d-flex flex-row justify-content-flex-start align-items-center">
                <Form.Label>Select Cattle Location:</Form.Label>
                <Button
                  variant="outline-primary"
                  className="mt-2 mb-2 ml-2"
                  onClick={getLocation}
                >
                  Use Current Location
                </Button>
              </Form.Row>

              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={13}
                center={userLocation ? userLocation : defaultcenter}
                options={options}
                onClick={onMapClick}
              >
                {cattleLocation && <RenderCattleMarker />}
              </GoogleMap>
            </Form.Group>

            <Form.Row>
              <Button
                variant="primary"
                hidden={userLocation != null ? true : false}
                onClick={getUserLocation}
              >
                Current Location
              </Button>
            </Form.Row>

            <div className="text-danger mt-3 mb-3">{errorText}</div>

            <Button variant="primary" type="submit">
              Submit Report
            </Button>
          </Form>
          <ToastContainer />
        </Col>
      </Row>
    </Container>
  );
}
