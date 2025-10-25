import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAbJ-1Mq_P8cP4c8I-NFwzEil1K7TA_708",
  authDomain: "live-location-7d9ee.firebaseapp.com",
  databaseURL: "https://live-location-7d9ee-default-rtdb.firebaseio.com",
  projectId: "live-location-7d9ee",
  storageBucket: "live-location-7d9ee.firebasestorage.app",
  messagingSenderId: "779687667185",
  appId: "1:779687667185:web:c47623363d772f21ac1050"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);