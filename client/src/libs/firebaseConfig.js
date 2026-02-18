// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth , GoogleAuthProvider} from "firebase/auth";

//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "expense-tracker-c7911.firebaseapp.com",
  projectId: "expense-tracker-c7911",
  storageBucket: "expense-tracker-c7911.firebasestorage.app",
  messagingSenderId: "520904958684",
  appId:import.meta.env.VITE_APP_ID,
  measurementId: "G-ZCPX1H35SD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleprovider = new GoogleAuthProvider();
export {app , auth , googleprovider};
//const analytics = getAnalytics(app);