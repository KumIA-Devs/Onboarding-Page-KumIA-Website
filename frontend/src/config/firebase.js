// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDS8hxHMs2QzHI7dk9BJ07aqXmushOqfIE",
  authDomain: "kumia-2eb9c.firebaseapp.com",
  projectId: "kumia-2eb9c",
  storageBucket: "kumia-2eb9c.firebasestorage.app",
  messagingSenderId: "15479558369",
  appId: "1:15479558369:web:e7dcf9d3b9fe951f67a7a0",
  measurementId: "G-V4WM65469L"
};

// Log para verificar configuración (remover en producción)
console.log('Firebase Config:', {
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
