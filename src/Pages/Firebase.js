// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

// // Your Firebase configuration
// const firebaseConfig = {
//   // Add your Firebase config here
  
// };

// // Initialize Firebase app
// const app = initializeApp(firebaseConfig);

// // Export Firestore instance
// export const db = getFirestore(app);


import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import 'firebase/compat/auth'

const firebaseConfig = {
  // your firebase config here

  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
