import React, { useState, useEffect } from 'react';
import { ref, onValue, query, orderByChild, equalTo, update, get } from 'firebase/database';
import { database, auth } from './firebase';

const MyShares = () => {
  const [myShares, setMyShares] = useState([]);
  const [revokedIds, setRevokedIds] = useState(new Set());

  useEffect(() => {
    const sharesRef = ref(database, 'locationShares');
    const myQuery = query(sharesRef, orderByChild('ownerEmail'), equalTo(auth.currentUser.email));
    
    const unsubscribe = onValue(myQuery, (snapshot) => {
      const shareData = snapshot.val();
      
      if (shareData) {
        const activeShares = Object.entries(shareData)
          .filter(([id, share]) => share.active && !revokedIds.has(id))
          .map(([id, share]) => ({ id, ...share }));

        // Remove duplicates by viewerEmail
        const uniqueShares = [];
        const seenEmails = new Set();
        activeShares.forEach(share => {
          if (!seenEmails.has(share.viewerEmail)) {
            seenEmails.add(share.viewerEmail);
            uniqueShares.push(share);
          }
        });
        
        setMyShares(uniqueShares);
      } else {
        setMyShares([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const revokeAccess = async (viewerEmail) => {
    setRevokedIds(prev => new Set([...prev, viewerEmail]));
    try {
      const sharesQuery = query(ref(database, 'locationShares'), orderByChild('ownerEmail'), equalTo(auth.currentUser.email));
      const snapshot = await get(sharesQuery);
      const shares = snapshot.val();
      if (shares) {
        Object.entries(shares).forEach(([id, share]) => {
          if (share.viewerEmail === viewerEmail && share.active) {
            update(ref(database, `locationShares/${id}`), { ...share, active: false });
          }
        });
      }
    } catch (error) {
      console.error('Error revoking access:', error);
      setRevokedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(viewerEmail);
        return newSet;
      });
    }
  };

  if (myShares.length === 0) {
    return (
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-b border-gray-700/50 p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-400 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm">🔓</span>
            </div>
            <div>
              <h3 className="text-white font-semibold">Access Granted</h3>
              <p className="text-gray-400 text-xs">People you've shared your location with</p>
            </div>
          </div>
        </div>
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-gray-700/50 rounded-xl flex items-center justify-center mx-auto mb-4 border border-gray-600">
            <span className="text-2xl">📤</span>
          </div>
          <h4 className="text-white font-semibold mb-2">No Active Shares</h4>
          <p className="text-gray-400 text-sm">Share your location to see granted access here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-b border-gray-700/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-400 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm">🔓</span>
            </div>
            <div>
              <h3 className="text-white font-semibold">Access Granted</h3>
              <p className="text-gray-400 text-xs">{myShares.length} active share(s)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-xs font-medium">ACTIVE</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-2">
        {myShares.map((share) => (
          <div key={share.id} className="bg-gray-700/30 border border-gray-600/50 rounded-xl p-3 hover:bg-gray-700/50 transition-all">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-400 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">👤</span>
                </div>
                <div>
                  <span className="font-medium text-white text-sm">{share.viewerEmail}</span>
                  <div className="text-xs text-gray-400">
                    Last update: {new Date(share.lastUpdate || share.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
              <button
                onClick={() => revokeAccess(share.viewerEmail)}
                className="bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/50 text-red-400 px-3 py-1 rounded-lg hover:bg-red-500/30 transition-all duration-300 font-medium text-xs"
              >
                Revoke
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyShares;