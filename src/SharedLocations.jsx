import React, { useState, useEffect } from 'react';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { database, auth } from './firebase';
import L from 'leaflet';

const SharedLocations = () => {
  const [sharedLocations, setSharedLocations] = useState([]);

  useEffect(() => {
    const sharesRef = ref(database, 'locationShares');
    const userQuery = query(sharesRef, orderByChild('viewerEmail'), equalTo(auth.currentUser.email));
    
    const unsubscribe = onValue(userQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const locations = Object.entries(data)
          .filter(([_, share]) => share.active)
          .map(([id, share]) => ({ id, ...share }));
        setSharedLocations(locations);
      }
    });

    return () => unsubscribe();
  }, []);

  if (sharedLocations.length === 0) {
    return (
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-gray-700/50 p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-400 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm">👥</span>
            </div>
            <div>
              <h3 className="text-white font-semibold">Network Contacts</h3>
              <p className="text-gray-400 text-xs">Shared locations from your network</p>
            </div>
          </div>
        </div>
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-gray-700/50 rounded-xl flex items-center justify-center mx-auto mb-4 border border-gray-600">
            <span className="text-2xl">🔍</span>
          </div>
          <h4 className="text-white font-semibold mb-2">No Active Contacts</h4>
          <p className="text-gray-400 text-sm">Request location access from contacts to see them here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-gray-700/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-400 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm">👥</span>
            </div>
            <div>
              <h3 className="text-white font-semibold">Network Contacts</h3>
              <p className="text-gray-400 text-xs">{sharedLocations.length} active contact(s)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-xs font-medium">LIVE</span>
          </div>
        </div>
      </div>
      
      <div className="h-64 lg:h-80">
        <MapContainer 
          center={sharedLocations[0].location} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {sharedLocations.map((share) => (
            <Marker key={share.id} position={share.location}>
              <Popup>
                <div className="text-center">
                  <strong>🛰 {share.ownerEmail}</strong>
                  <br />
                  <small>Last seen: {new Date(share.timestamp).toLocaleString()}</small>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      <div className="p-4 space-y-2">
        {sharedLocations.map((share) => (
          <div key={share.id} className="bg-gray-700/30 border border-gray-600/50 rounded-xl p-3 hover:bg-gray-700/50 transition-all">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-400 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">🛰</span>
                </div>
                <div>
                  <span className="font-medium text-white text-sm">{share.ownerEmail}</span>
                  <div className="text-xs text-gray-400">
                    {new Date(share.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs font-medium bg-green-400/10 px-2 py-1 rounded">ACTIVE</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SharedLocations;