import React, { useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { Container, Form, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';

const mapContainerStyle = {
    width: '50vw',
    height: '50vh'
}

const options = {
    disableDefaultUI: true,
    zoomControl: true
}


export default function Reports() {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyDgxTYG7n4gf5qpLdeA_pC_RcTQAc7wdWk"
    })

    const [cattleLocation, setCattleLocation] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const onMapClick = useCallback((event) => {
        setCattleLocation({
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        })
    }, [])

    const [errorText, setErrorText] = useState('');
    // animalCondition
    //   animalCount
    //   animalImageUrl
    //   animalIsMoving
    //   animalType
    //   comments
    //   coordinates
    //   userCoords
    //   createdAt
    //   description
    //   uid
    const onFormSubmit = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
    }

    if (loadError) return "Error Loading maps"
    if (!isLoaded) return "Loading"


  
    let userMarker;
    if (userLocation) {
        if (!(userLocation === cattleLocation)) {            
            userMarker = (
                <Marker 
                    icon={{
                        url: '/location.svg',
                        scaledSize: new window.google.maps.Size(30, 30)
                    }}
                    position={userLocation}
                />
            )
        }
    }
    let cattleMarker;
    if (cattleLocation) {
        cattleMarker = (
            <Marker icon={{
                url: '/cow.svg',
                scaledSize: new window.google.maps.Size(30, 30)
            }}
                position={cattleLocation}
            />
        )
    }

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setCattleLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
            }, (error) => {
                toast.error("error"); console.log(error);
            }, { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true }
            );            
        } else {
            toast.error("Function not supported")
        }
    }
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
            }, (error) => {
                toast.error("error"); console.log(error);
            }, { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true }
            );            
        } else {
            toast.error("Function not supported")
        }
    }

    return (

        <Container className="justify-content-md-center">
            <h1>Report Cattle</h1>
            <Form onSubmit={(e) => onFormSubmit(e)}>
                <Form.Group controlId="animalCondition">
                    <Form.Label>Animal Condition</Form.Label>
                    <Form.Control as="select">
                        <option>Death</option>
                        <option>Injured</option>
                        <option>Normal</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="animalCount">
                    <Form.Label>Animal Count</Form.Label>
                    <Form.Control type="email" placeholder="name@example.com" />
                </Form.Group>
                <Form>
                    <Form.Group>
                        <Form.File id="animalImageUrl" label="Animal Image" />
                    </Form.Group>
                </Form>
                <Form.Check
                    type="switch"
                    id="animalIsMoving"
                    label="Animal is moving"
                />
                <Form.Group controlId="animalType">
                    <Form.Label>Animal Type</Form.Label>
                    <Form.Control as="select">
                        <option>Cow</option>
                        <option>Buffalo</option>
                        <option>Goat</option>
                        <option>Other</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows="3" />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Select Cattle Location:</Form.Label>
                    <Form.Row>
                        <Button variant="primary" onClick={getLocation}>Use Current Location</Button>
                    </Form.Row>
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        zoom={15}
                        center={cattleLocation ? cattleLocation : { lat: 21.170240, lng: 72.831062 }}
                        options={options}
                        onClick={onMapClick}
                    >
                        <h4 class="mapTitle">Report 🐄</h4>
                        {cattleMarker}
                        {/* {userMarker} */}
                    </GoogleMap>
                </Form.Group>

                <Form.Row>
                    <Button variant="primary" hidden={userLocation != null ? true : false} onClick={getUserLocation}>
                        Current Location
                    </Button>
                </Form.Row>


                <div style={{ color: "red", margin: 5 }}>{errorText}</div>
                <Button variant="primary" type="submit">
                    Report
                </Button>
            </Form>
            <ToastContainer />
        </Container>

    )
}
