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

const firebaseConfig = {
  // your firebase config here
  apiKey: "AIzaSyBLAe1He5yd6hXHs9vyipXWUFiFAQLUye0",
  authDomain: "rvrbrick.firebaseapp.com",
  projectId: "rvrbrick",
  storageBucket: "rvrbrick.appspot.com",
  messagingSenderId: "182259489957",
  appId: "1:182259489957:web:7015f8b5a08c11adf3014c",
  measurementId: "G-Z64Q4BV7PB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
