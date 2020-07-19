import React, { useState, useCallback, useContext } from 'react';
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { AuthContext } from "../data/auth";
import { Context } from "../data/context";
import firebase from "../data/firebase";
import Loading from "../components/LoadingScreen";
const mapContainerStyle = {
    width: '70vw',
    height: '70vh'
}

const defaultcenter = { lat: 21.170240, lng: 72.831062 }


const options = {
    disableDefaultUI: true,
    zoomControl: true
}

const cowAudio = new Audio('/Cow.mp3');
const goatAudio = new Audio('/Goat.mp3');

export default function Reports() {

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyDgxTYG7n4gf5qpLdeA_pC_RcTQAc7wdWk"
    })

    const { currentUser } = useContext(AuthContext);
    const { isLoading, setIsLoading, } = useContext(Context);

    const [cattleLocation, setCattleLocation] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [animalType, setAnimalType] = useState(null);

    const playAudio = () => {
        if (animalType === "Cow" || animalType === "Buffalo") {
            cowAudio.load(); cowAudio.play();
        } else if (animalType === "Goat") {
            goatAudio.load(); goatAudio.play();
        }
    }

    const onMapClick = 
        (event) => {
            setCattleLocation({
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            })
            playAudio();
        }
        
    

    const [errorText, setErrorText] = useState('');

    const onFormSubmit = (e) => {
        e.preventDefault();
        const animalCondition = e.target.animalCondition.value;
        const animalCount = e.target.animalCount.value;
        const animalImage = e.target.animalImageUrl.files[0];
        const animalIsMoving = e.target.animalIsMoving.checked;
        const animalType = e.target.animalType.value;
        const description = e.target.description.value;
        const email = currentUser.email;
        if (animalCondition === "Select") {
            setErrorText("Select animal condition"); return
        }
        if (animalCount < 0 || animalCount > 60) {
            setErrorText("Enter valid animal count"); return
        }
        if (!animalImage) {
            setErrorText("Select image"); return
        }
        if (animalType === "Select") {
            setErrorText("Select animal type"); return
        }
        if (description === "") {
            setErrorText("Enter description"); return
        }
        if (!cattleLocation) {
            setErrorText("Select cattle location"); return
        }
        // if (!userLocation) {
        //     setErrorText("Provide user location"); return
        // }
        setIsLoading(true)
        const uploadTask = firebase.storage().ref('reportImages/').child()
        uploadTask.put(animalImage).on("state_changed",
            function (snapshot) {
                switch (snapshot.state) {
                    case firebase.storage.TaskState.RUNNING:
                        console.log("Upload running");
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
            () => {
                uploadTask.getDownloadURL().then((url) => {
                    firebase.firestore().collection("reports").add({
                        animalCondition,
                        animalCount,
                        animalIsMoving,
                        animalType,
                        comments: [],
                        coordinates: cattleLocation,
                        userCoords: userLocation,
                        createdAt: firebase.firestore.Timestamp.now(),
                        description,
                        email,
                        animalImageUrl: url
                    }).then(() => {
                        setIsLoading(false);
                        console.log("completed");
                    }).catch((error) => { toast.error(error.message) })
                });
            }
        );

    }

    if (loadError) return "Error Loading maps"
    if (!isLoaded) return <Loading text="Loading" />

    if (isLoading) return <Loading text="Loading" />


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
        let url = '/location-pin.svg';
        url = animalType === "Cow" ? '/cow.svg' : url;
        url = animalType === "Buffalo" ? '/buffalo.svg' : url;
        url = animalType === "Goat" ? '/goat.svg' : url;
        cattleMarker = (
            <Marker icon={{
                url,
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
            <Form onSubmit={(e) => onFormSubmit(e)} className="col-lg-6">
                <Form.Group controlId="animalCondition">
                    <Form.Label>Animal Condition</Form.Label>
                    <Form.Control as="select">
                        <option>Select</option>
                        <option>Death</option>
                        <option>Injured</option>
                        <option>Normal</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="animalCount">
                    <Form.Label>Animal Count</Form.Label>
                    <Form.Control required type="number" placeholder="Approximate animal count" />
                </Form.Group>
                <Form.Group>
                    <Form.File id="animalImageUrl" max={1} label="Animal Image" />
                </Form.Group>
                <Form.Group>
                    <Form.Label >
                        Status
                    </Form.Label>

                    <Form.Check
                        type="checkbox"
                        label="moving"
                        name="animalIsMoving"
                        id="animalMoving1"
                    />
                </Form.Group>

                <Form.Group controlId="animalType">
                    <Form.Label>Animal Type</Form.Label>
                    <Form.Control as="select" onChange={(e) => setAnimalType(e.target.value)}>
                        <option>Select</option>
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
                        center={defaultcenter}
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
