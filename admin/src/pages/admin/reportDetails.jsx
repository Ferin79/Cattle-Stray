import React, {useEffect, useState} from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker} from "react-google-maps"
import { MarkerWithLabel } from "react-google-maps/lib/components/addons/MarkerWithLabel"
import firebase from "../../data/firebase";


const MyMapComponent = compose(
    // AIzaSyCe66OVhbLjhVls27VDc8jKACUM6AyHNx8
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDgxTYG7n4gf5qpLdeA_pC_RcTQAc7wdWk&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `800px` }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
)((props) =>
    <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: -34.397, lng: 150.644 }}
        center={props.markerCoords}
        zoom={props.markerCoords ? 16:8}
    >
        
        {props.markerCoords && <Marker icon={{colour: "blue"}} position={{ lat: props.markerCoords.lat, lng: props.markerCoords.lng }} onClick={props.onMarkerClick} />}
    </GoogleMap>
)


export default function ReportDetails({match}) {    
    
    const [report, setReport] = useState({});
    const [coordinates, setCoordinates] = useState({});    
    const [isMarkerShown, setIsMarkerShown] = useState(false);
    useEffect(() => {
        getReport();
        console.log(match.params.reportId);     
    }, [setReport, setCoordinates])
    const getReport = () => {
        firebase.firestore().collection("reports").doc(match.params.reportId).get()
            .then((doc) => {
                const lat = doc.data().coordinates.latitude;
                const lng = doc.data().coordinates.longitude;
                setReport(doc.data());                
                setCoordinates({lat,lng})
                showMarker();
            }).catch((error) => {
                console.log(error.message);
            })
    }
    const handleMarkerClick = () => {
        setIsMarkerShown(false)
        showMarker()
    }
    const showMarker = () => {   
        setTimeout(() => {            
            setIsMarkerShown(true)        
        }, 500);     
    }


    


    return (
        <MyMapComponent
            isMarkerShown={isMarkerShown}
            onMarkerClick={handleMarkerClick}
            markerCoords={coordinates}
        />
    )
}
