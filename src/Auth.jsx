import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

const Auth = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onAuthSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full blur-xl float-animation"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl float-animation" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-full blur-xl float-animation" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-700/50 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6 pulse-glow">
            <span className="text-3xl">🛰</span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            {isLogin ? 'Welcome Back' : 'Join TrackMe'}
          </h2>
          <p className="text-gray-400">
            {isLogin ? 'Access your location network' : 'Start sharing your journey'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-cyan-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="relative w-full p-4 bg-gray-700/50 border border-gray-600 rounded-2xl focus:border-cyan-400 focus:outline-none transition-all text-white placeholder-gray-400"
              required
            />
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-cyan-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="relative w-full p-4 bg-gray-700/50 border border-gray-600 rounded-2xl focus:border-cyan-400 focus:outline-none transition-all text-white placeholder-gray-400"
              required
            />
          </div>
          
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-2xl p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-cyan-400 text-white p-4 rounded-2xl hover:from-red-600 hover:to-cyan-500 transition-all duration-300 font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 relative overflow-hidden group"
          >
            <span className="relative z-10">{isLogin ? 'Access Network' : 'Join Network'}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </form>
        
        <div className="text-center mt-8">
          <p className="text-gray-400">
            {isLogin ? "New to TrackMe? " : "Already have access? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-cyan-400 hover:text-red-400 font-semibold transition-colors"
            >
              {isLogin ? 'Create Account' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;