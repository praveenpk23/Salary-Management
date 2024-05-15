import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// Initialize Firebase
const firebaseConfig = {
  // Replace with your Firebase configuration
  apiKey: "AIzaSyBLAe1He5yd6hXHs9vyipXWUFiFAQLUye0",
  authDomain: "rvrbrick.firebaseapp.com",
  projectId: "rvrbrick",
  storageBucket: "rvrbrick.appspot.com",
  messagingSenderId: "182259489957",
  appId: "1:182259489957:web:7015f8b5a08c11adf3014c",
  measurementId: "G-Z64Q4BV7PB"
};

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

const Passcode = () => {
  const [passcode, setPasscode] = useState("");

  useEffect(() => {
    // Fetch the passcode from Firestore
    firestore
      .collection("passcode")
      .get()
      .then((querySnapshot) => {
        // Get the first document in the collection
        const doc = querySnapshot.docs[0];

        // If a document exists, set the passcode state
        if (doc && doc.exists) {
          setPasscode(doc.data().passcode);
        } else {
          console.log("No passcode found in Firestore");
        }
      })
      .catch((error) => {
        console.error("Error fetching document: ", error);
      });
  }, []);

  return (
    <div>
      <h1>Passcode Collection</h1>
      <p>Passcode: {passcode}</p>
    </div>
  );
};

export default Passcode;
