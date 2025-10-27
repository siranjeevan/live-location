import React, { useState } from 'react';
import { ref, push, set } from 'firebase/database';
import { database, auth } from './firebase';

const LocationShare = ({ userLocation }) => {
  const [shareEmail, setShareEmail] = useState('');
  const [shareMessage, setShareMessage] = useState('');

  const shareLocation = async () => {
    if (!shareEmail || !userLocation) return;
    
    try {
      const shareRef = ref(database, 'locationShares');
      const newShareRef = push(shareRef);
      
      await set(newShareRef, {
        ownerEmail: auth.currentUser.email,
        ownerUid: auth.currentUser.uid,
        viewerEmail: shareEmail,
        location: userLocation,
        timestamp: Date.now(),
        active: true
      });
      
      setShareMessage('Location shared successfully!');
      setShareEmail('');
      setTimeout(() => setShareMessage(''), 3000);
    } catch (error) {
      setShareMessage('Error sharing location');
    }
  };

  return (
    <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-b border-gray-700/50 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-400 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm">🔗</span>
          </div>
          <div>
            <h3 className="text-white font-semibold">Share Access</h3>
            <p className="text-gray-400 text-xs">Grant location access to contacts</p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-400/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <input
              type="email"
              placeholder="Enter contact email"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className="relative w-full p-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:border-emerald-400 focus:outline-none transition-all text-white placeholder-gray-400 text-sm"
            />
          </div>
          <button
            onClick={shareLocation}
            disabled={!shareEmail || !userLocation}
            className="bg-gradient-to-r from-green-500 to-emerald-400 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 transition-all duration-300 font-medium transform hover:scale-105 disabled:transform-none disabled:opacity-50 text-sm"
          >
            Grant Access
          </button>
        </div>
        
        {shareMessage && (
          <div className="mt-3 bg-green-500/10 border border-green-500/30 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <p className="text-green-400 font-medium text-sm">{shareMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationShare;