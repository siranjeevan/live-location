import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Auth from './Auth';
import MapView from './MapView';
import SharedLocations from './SharedLocations';

// Main App component
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6 pulse-glow">
            <span className="text-3xl">🛰</span>
          </div>
          <div className="text-2xl font-bold text-white mb-2">Initializing TrackMe</div>
          <div className="text-cyan-400 text-sm">Connecting to network...</div>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={() => setUser(auth.currentUser)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-full blur-3xl float-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl float-animation" style={{animationDelay: '2s'}}></div>
      </div>
      
      <header className="bg-gray-800/30 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-cyan-400 rounded-2xl flex items-center justify-center pulse-glow">
                <span className="text-2xl">🛰</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  TrackMe
                </h1>
                <p className="text-xs text-gray-400">Live Location Network</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-3 bg-gray-700/50 rounded-2xl px-4 py-2 border border-gray-600">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">{user.email}</span>
                <div className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-lg">ONLINE</div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/50 text-red-400 px-6 py-2 rounded-2xl hover:bg-red-500/30 transition-all duration-300 font-medium"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6">
          {/* Mobile: Shared locations first, Desktop: Your location first */}
          <div className="order-2 lg:order-1">
            <MapView />
          </div>
          <div className="order-1 lg:order-2">
            <SharedLocations />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
