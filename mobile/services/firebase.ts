// Firebase initialization for Expo/web using Firebase Web SDK
// Fill the config below with your Firebase project's settings
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBnGOF5b9wKLJpp9NImfdmGSsCC-EJxUWU",
  authDomain: "gestion-locative-801d8.firebaseapp.com",
  projectId: "gestion-locative-801d8",
  storageBucket: "gestion-locative-801d8.firebasestorage.app",
  messagingSenderId: "101964026415",
  appId: "1:101964026415:web:4fd9547c6deaa7a8b06cda",
  measurementId: "G-LPQNQ1S8KD"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Use standard getAuth() — token persistence is handled manually via SecureStore
const auth = getAuth(app);

export { auth };
