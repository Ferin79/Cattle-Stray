import React, { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { ToastContainer, toast } from "react-toastify";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Circle,
  TrafficLayer,
} from "react-google-maps";
import Autocomplete from "react-google-autocomplete";
import Geocode from "react-geocode";
import { Context } from "../../data/context";
import * as geofirestore from "geofirestore";
import firebase from "../../data/firebase";

Geocode.setApiKey("AIzaSyCQhpaJ_cJAxcimwxdRbM6P6cjlfxDHwLw");
Geocode.enableDebug();

const ViewReportByLocation = () => {
  const { role } = useContext(Context);

  const firestore = firebase.firestore();
  const GeoFirestore = geofirestore.initializeApp(firestore);
  const geocollection = GeoFirestore.collection("reports");

  const [coordinates, setCoordinates] = useState({
    lat: 21.17024,
    lng: 72.831062,
  });
  const [radius, setRadius] = useState(1);
  const [onTapCoordinates, setOnTapCoordinates] = useState(null);
  const [reports, setReports] = useState([]);

  const fetchReports = (lat, lng, radius) => {
    setReports([]);
    const query = geocollection.near({
      center: new firebase.firestore.GeoPoint(lat, lng),
      radius: Number(radius),
    });

    query.get().then((value) => {
      const data = [];
      value.docs.forEach((doc) => {
        data.push(doc.data());
      });

      setReports([...data]);
    });
  };

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

  const MyMapComponent = compose(
    // AIzaSyCe66OVhbLjhVls27VDc8jKACUM6AyHNx8
    withProps({
      googleMapURL:
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyDgxTYG7n4gf5qpLdeA_pC_RcTQAc7wdWk&v=3.exp&libraries=geometry,drawing,places",
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `700px` }} />,
      mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
  )((props) => (
    <div style={{ position: "relative" }}>
      <GoogleMap
        defaultCenter={{ lat: -34.397, lng: 150.644 }}
        center={onTapCoordinates ? onTapCoordinates : coordinates}
        zoom={15}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
        }}
        onClick={(event) => {
          setOnTapCoordinates({
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          });
          fetchReports(event.latLng.lat(), event.latLng.lng(), radius);
        }}
      >
        <Autocomplete
          style={{
            width: "20%",
            height: "50px",
            marginTop: "10px",
          }}
          onPlaceSelected={(place) => {
            if (place.geometry.location.lat()) {
              setOnTapCoordinates({
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              });
              fetchReports(
                place.geometry.location.lat(),
                place.geometry.location.lng(),
                radius
              );
            }
          }}
          types={["(regions)"]}
        />
        {onTapCoordinates && (
          <Marker
            position={onTapCoordinates}
            icon={{
              url: require("../../images/location-pin.svg"),
              scaledSize: new window.google.maps.Size(30, 30),
            }}
          />
        )}

        {onTapCoordinates && (
          <Circle
            defaultCenter={coordinates}
            defaultRadius={radius}
            center={onTapCoordinates}
            radius={radius * 1000}
            visible={true}
            defaultVisible={true}
            options={{
              strokeColor: "#0AF",
            }}
          />
        )}

        {reports.map((item) => {
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
              onClick={() => console.log(item)}
            />
          );
        })}

        <TrafficLayer autoUpdate />
      </GoogleMap>
    </div>
  ));

  if (role !== "admin") {
    return (
      <div>
        <h1>You are not supposed to be here.</h1>
      </div>
    );
  }

  return (
    <Container fluid>
      <Row className="mt-5">
        <Col xs="12" md="12" xl="12" lg="auto">
          <div
            style={{
              width: "90vw",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h5>Tap on map to see Reports</h5>

            <Form
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Radius</Form.Label>
                <Form.Control
                  type="number"
                  required
                  min={1}
                  placeholder="Enter Radius"
                  value={radius}
                  onChange={(event) => {
                    setRadius(event.target.value);
                    if (onTapCoordinates) {
                      fetchReports(
                        onTapCoordinates.lat,
                        onTapCoordinates.lng,
                        event.target.value
                      );
                    }
                  }}
                />
              </Form.Group>
            </Form>
          </div>
          <MyMapComponent />
        </Col>
      </Row>

      <Row className="mt-5 mb-5">
        <Col>
          {reports.length > 0 && (
            <Card style={{ width: "18rem" }}>
              <Card.Header></Card.Header>
              <Card.Body>
                <Card.Title>{reports.length}</Card.Title>
                <Card.Text>Total Reports</Card.Text>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
};

export default ViewReportByLocation;
