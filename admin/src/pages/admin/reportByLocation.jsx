import React, { useState, useCallback, useRef } from "react";
import { NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import RangeSlider from 'react-bootstrap-range-slider';
import { ToastContainer, toast } from "react-toastify";
import Loading from "../../components/LoadingScreen";
import { GoogleMap, useLoadScript, Marker, Circle, InfoWindow } from "@react-google-maps/api";
import usePlacesAutoComplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import * as geofirestore from "geofirestore";
import firebase from "../../data/firebase";
import { Col } from "react-bootstrap";
const cowIcon = require("../../images/cow.svg")
const buffaloIcon = require("../../images/buffalo.svg")
const goatIcon = require("../../images/goat.svg")
const locationIcon = require("../../images/location-pin.svg")

const mapContainerStyle = {
  width: "100%",
  height: "80vh",
};

const defaultcenter = { lat: 21.1702, lng: 72.8311 };

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const libraries = ["places"]

export default function Reports() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCQhpaJ_cJAxcimwxdRbM6P6cjlfxDHwLw",
    libraries,
  });

  const firestore = firebase.firestore();
  const GeoFirestore = geofirestore.initializeApp(firestore);
  const geocollection = GeoFirestore.collection("reports");


  const [coordinates, setCoordinates] = useState(null);
  const [reports, setReports] = useState([])
  const [selectedMarker, setSelectedMarker] = useState(null)
  const [radius, setRadius] = useState(1)
  const defaultZoom = 12.5
  const zoom = 15


  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map
  }, [],
  )

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng })    
    setCoordinates({ lat, lng });
  }, [],
  )
  const zoomTo = useCallback((r) => {
    let offset
    if (r < 4){
      offset = 0.2              
    }else if (r == 4) {
      offset = 0.28                    
    }else {
      offset = 0.4
    }
    mapRef.current.setZoom(16.5 - r + (r * offset))        
  }, [],
  )

  const getReports = useCallback(({lat, lng}) => {
    setSelectedMarker(null)

    const query = geocollection.near({
      center: new firebase.firestore.GeoPoint(lat, lng),
      radius: Number(radius),
    });

    query.get().then((value) => {
      const data = [];
      value.docs.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });

      setReports([...data]);
      zoomTo(radius)
      console.log("setReports");

    });
  }, [radius],
  )

  const onMapClick = (event) => {
    setSelectedMarker(null)

    const lat = event.latLng.lat()
    const lng = event.latLng.lng()

    setCoordinates({ lat, lng });

    panTo({ lat, lng });
    zoomTo(radius)

    getReports({ lat, lng })
  };

  if (loadError) return "Error Loading maps";

  if (!isLoaded) return <Loading text="Loading" />;

  let circle
  if (coordinates) {
    circle =
      <Circle
        center={coordinates}
        radius={radius * 1000}
        visible={true}
        options={{ strokeColor: "#0AF", }}
        onClick={onMapClick}
      />

  }

  let markers;
  if (reports.length > 0) {
    markers = (
      reports.map((report) => {
        let url = locationIcon;
        url = report.animalType === "cow" ? cowIcon : url;
        url = report.animalType === "buffalo" ? buffaloIcon : url;
        url = report.animalType === "goat" ? goatIcon : url;
        return (
          <Marker
            key={report.id}
            icon={{
              url,
              scaledSize: new window.google.maps.Size(30, 30),
            }}
            position={{
              lat: report.animalMovingCoords.Va,
              lng: report.animalMovingCoords.ga,
            }}
            onClick={() => {
              setSelectedMarker(report)
            }}
          />)
      })
    )
  }

  let infoWindow
  if (selectedMarker) {
    const report = selectedMarker
    infoWindow =
      <InfoWindow
        position={{ lat: report.animalMovingCoords.Va, lng: report.animalMovingCoords.ga }}
        onCloseClick={() => { setSelectedMarker(null) }}
      >
        <>
          <h4>{report.createdAt.toDate().toLocaleString()}</h4>
          <h5>Animal Count : {report.animalCount}</h5>
          <div>{report.description}</div>

          <NavLink
            to={`/admin/report/${report.id}`}
            className="changeNavButtonColor">
            <Button variant="info">Details</Button>
          </NavLink>

        </>
      </InfoWindow>
  }

  return (
    <Container>
      <Row className="d-flex justify-content-center align-items-center mt-5 mb-5">

        <Col>
          <Search panTo={panTo} getReports={getReports} />
        </Col>

        <Col>
          <h5>Search Radius</h5>
          <RangeSlider
            value={radius}
            disabled={!coordinates ? true : false}
            min={1} max={8}
            onChange={(event) => { setRadius(event.target.value) }}
            onAfterChange={() => { getReports(coordinates) }}
          />
        </Col>

        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={defaultZoom}
          center={defaultcenter}
          options={options}
          onClick={onMapClick}
          onLoad={onMapLoad}
        >

          {circle}

          {markers}

          {infoWindow}
        </GoogleMap>

        <ToastContainer />

      </Row>
    </Container>
  );
}


function Search({ panTo, getReports }) {
  const { ready, value, suggestions: { status, data }, setValue, clearSuggestions } = usePlacesAutoComplete({
    requestOptions: {
      location: { lat: () => 21.1702, lng: () => 72.8311 },
      radius: 1 * 1000
    }
  });

  return (
    <div classname="search">
      <Combobox        
        onSelect={async (address) => {
          setValue(address, false);
          clearSuggestions();
          try {
            const results = await getGeocode({ address })
            const { lat, lng } = await getLatLng(results[0])
            panTo({ lat, lng })
            getReports({ lat, lng })

          } catch (error) {
            console.log(error)
          }
        }
        }>
        <ComboboxInput
          className="searchInput"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          disabled={!ready}
          placeHolder="Enter a location..."
        />
        <ComboboxPopover>
          {status === "OK" &&
            data.map(({ id, description }) => (
              <ComboboxOption key={id} value={description} />
            ))}
        </ComboboxPopover>
      </Combobox>
    </div>
  )
}