import React, { useState, useCallback, useRef } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { ToastContainer, toast } from "react-toastify";
import Loading from "../../components/LoadingScreen";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Circle,
  InfoWindow,
} from "@react-google-maps/api";
import usePlacesAutoComplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import * as geofirestore from "geofirestore";
import firebase from "../../data/firebase";
const cowIcon = require("../../images/cow.svg");
const buffaloIcon = require("../../images/buffalo.svg");
const goatIcon = require("../../images/goat.svg");

const mapContainerStyle = {
  width: "100%",
  height: "80vh",
};

const defaultcenter = { lat: 21.1702, lng: 72.8311 };

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const libraries = ["places"];

export default function Reports() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCQhpaJ_cJAxcimwxdRbM6P6cjlfxDHwLw",
    libraries,
  });

  const firestore = firebase.firestore();
  const GeoFirestore = geofirestore.initializeApp(firestore);
  const geocollection = GeoFirestore.collection("reports");

  const [coordinates, setCoordinates] = useState(null);
  const [reports, setReports] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [radius, setRadius] = useState(1);
  const defaultZoom = 12.5;
  const zoom = 15;

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(zoom);
    setCoordinates({ lat, lng });
  }, []);

  const getReports = useCallback(
    (lat, lng) => {
      setSelectedMarker(null);

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
        console.log("setReports");
      });
    },
    [geocollection, radius]
  );

  const onMapClick = (event) => {
    setSelectedMarker(null);

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    setCoordinates({ lat, lng });

    panTo({ lat, lng });

    getReports(lat, lng);
  };

  if (loadError) return "Error Loading maps";

  if (!isLoaded) return <Loading text="Loading" />;

  let circle;
  if (coordinates) {
    circle = (
      <Circle
        center={coordinates}
        radius={radius * 1000}
        visible={true}
        options={{ strokeColor: "#0AF" }}
        onClick={onMapClick}
      />
    );
  }

  let markers;
  if (reports.length > 0) {
    markers = reports.map((report) => {
      let url = require("../../images/location-pin.svg");
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
            setSelectedMarker(report);
          }}
        />
      );
    });
  }

  let infoWindow;
  if (selectedMarker) {
    infoWindow = (
      <InfoWindow
        position={{
          lat: selectedMarker.animalMovingCoords.Va,
          lng: selectedMarker.animalMovingCoords.ga,
        }}
        onCloseClick={() => {
          setSelectedMarker(null);
        }}
      >
        <>
          <h2>{selectedMarker.createdAt.toDate().toLocaleString()}</h2>
          <h2>{selectedMarker.animalType}</h2>
          <h4>{selectedMarker.animalCount}</h4>
          <h4>{selectedMarker.description}</h4>
        </>
      </InfoWindow>
    );
  }

  return (
    <Container>
      <Row className="d-flex justify-content-center align-items-center mt-5 mb-5">
        <Search panTo={panTo} getReports={getReports} />

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
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutoComplete({
    requestOptions: {
      location: { lat: () => 21.1702, lng: () => 72.8311 },
      radius: 1 * 1000,
    },
  });

  return (
    <div className="search">
      <Combobox
        onSelect={async (address) => {
          setValue(address, false);
          clearSuggestions();

          try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            panTo({ lat, lng });
            getReports(lat, lng);
          } catch (error) {
            console.log(error);
          }
        }}
      >
        <ComboboxInput
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          disabled={!ready}
          placeholder="Enter a location..."
        />
        <ComboboxPopover>
          {status === "OK" &&
            data.map(({ id, description }) => (
              <ComboboxOption key={id} value={description} />
            ))}
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
