import React, { useState, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
};

function GoogleMapTest() {
  const [zip, setZip] = useState('');
  const [center, setCenter] = useState({ lat: 37.7749, lng: -122.4194 });
  const [restaurants, setRestaurants] = useState([]);
  const mapRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const handleSearch = () => {
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address: zip }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        const latLng = {
          lat: location.lat(),
          lng: location.lng(),
        };

        setCenter(latLng);

        const request = {
          location: latLng,
          radius: '2000',
          type: 'restaurant',
        };

        const service = new window.google.maps.places.PlacesService(mapRef.current);
        service.nearbySearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setRestaurants(results);
          } else {
            setRestaurants([]);
            alert('No restaurants found!');
          }
        });
      } else {
        alert('Invalid ZIP code!');
      }
    });
  };

  if (loadError) return <div>Map failed to load</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <input
        type="text"
        placeholder="Enter ZIP code"
        value={zip}
        onChange={(e) => setZip(e.target.value)}
      />
      <button onClick={handleSearch}>Search Restaurants</button>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={(map) => (mapRef.current = map)}
      >
        {restaurants.map((place) => (
          <Marker
            key={place.place_id}
            position={place.geometry.location}
            title={place.name}
          />
        ))}
      </GoogleMap>
    </div>
  );
}

export default GoogleMapTest;
