import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Define custom icon for the waypoints
const vertiportIcon = new L.Icon({
    iconUrl: '/arrow-logo.svg',
    iconRetinaUrl: '/arrow-logo.svg',
    iconAnchor: [10, 10],
    popupAnchor: [10, -44],
    iconSize: [25, 25],
});

// Component to add and manage waypoints on the map
const LocationMarker = ({addMode}) => {
    // Keep track of all waypoints
    const [markers, setMarkers] = useState([]);
    // Keep track of currently selected waypoint
    const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);
    // A state variable to force a re-render
    const [forceRender, setForceRender] = useState(0);

    // Enable click event on the map
    useMapEvents({
        click: (e) => {
            // If in add mode, add new waypoint at click location
            if(addMode) {
                setMarkers([
                    ...markers,
                    { position: e.latlng, oneWay: 100000, return: 50000 }
                ]);
            }
        },
    });

    // Render waypoints and circles
    return (
        <>
            {markers.map((marker, idx) =>
                <div key={`marker-${idx}-${forceRender}`}>
                    <Marker 
                        position={marker.position} 
                        icon={vertiportIcon} 
                        eventHandlers={{
                            click: () => {
                                // On marker click, select this marker and force a re-render
                                setSelectedMarkerIndex(idx);
                                setForceRender(forceRender + 1);
                            },
                        }}
                    />
                    <Circle 
                        center={marker.position} 
                        radius={marker.oneWay} 
                        color="blue" 
                        fillOpacity={idx === selectedMarkerIndex ? 0.3 : 0.0} 
                        interactive={false}
                    />
                    <Circle 
                        center={marker.position} 
                        radius={marker.return} 
                        color="red" 
                        fillOpacity={idx === selectedMarkerIndex ? 0.3 : 0.1} 
                        interactive={false}
                    />
                </div>
            )}
        </>
    )
}

// Main map component
const MapComponent = () => {
    // Manage add waypoint mode
    const [addMode, setAddMode] = useState(false);

    return (
        <div>
            <button onClick={() => setAddMode(!addMode)}>
                {addMode ? "Finish Adding Waypoints" : "Add Waypoint"}
            </button>
            <MapContainer center={[51.505, -0.09]} zoom={5} style={{ height: "100vh", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker addMode={addMode} />
            </MapContainer>
        </div>
    );
}

export default MapComponent;
