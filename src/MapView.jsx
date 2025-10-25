import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ref, set, onDisconnect } from 'firebase/database';
import { database, auth } from './firebase';
import LocationShare from './LocationShare';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Main MapView component
const MapView = () => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);

  // Function to handle location success
  const handleLocationSuccess = async (pos) => {
    const { latitude, longitude } = pos.coords;
    const newPosition = [latitude, longitude];
    setPosition(newPosition);
    setError(null);
    
    // Update location in Firebase
    try {
      const userLocationRef = ref(database, `userLocations/${auth.currentUser.uid}`);
      await set(userLocationRef, {
        email: auth.currentUser.email,
        location: newPosition,
        timestamp: Date.now(),
        online: true
      });
      
      // Set offline when user disconnects
      onDisconnect(userLocationRef).update({ online: false });
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  // Function to handle location error
  const handleLocationError = (err) => {
    setError(err.message);
    setPosition(null);
  };

  // Use useEffect to request location permission and watch position
  useEffect(() => {
    let watchId = null;
    
    // Request current position first
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleLocationSuccess, handleLocationError);

      // Watch for position changes
      watchId = navigator.geolocation.watchPosition(handleLocationSuccess, handleLocationError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      });
    } else {
      setError('Geolocation is not supported by this browser.');
    }

    // Cleanup on unmount
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Location Access Required</h3>
            <p className="text-red-400 text-sm mb-1">{error}</p>
            <p className="text-gray-400 text-xs">Enable GPS access to start tracking</p>
          </div>
        </div>
      </div>
    );
  }

  if (!position) {
    return (
      <div className="space-y-4">
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/30 pulse-glow">
              <span className="text-2xl">🛰</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Acquiring Signal</h3>
            <p className="text-cyan-400 text-sm mb-3">Connecting to GPS satellites...</p>
            <div className="flex justify-center">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Compact Your Location Card */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
        <div className="bg-gradient-to-r from-red-500/20 to-cyan-400/20 border-b border-gray-700/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-cyan-400 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm">🗺️</span>
              </div>
              <div>
                <h2 className="text-white font-semibold">Your Position</h2>
                <p className="text-gray-400 text-xs">GPS tracking active</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-xs font-medium">LIVE</span>
            </div>
          </div>
        </div>
        <div className="h-48 lg:h-80">
          <MapContainer 
            center={position} 
            zoom={15} 
            style={{ height: '100%', width: '100%' }}
            key={`map-${position[0]}-${position[1]}`}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={position}>
              <Popup>
                <div className="text-center">
                  <strong>🛰 Your Position</strong>
                  <br />
                  <small>Last update: {new Date().toLocaleTimeString()}</small>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
      
      <LocationShare userLocation={position} />
    </div>
  );
};

export default MapView;