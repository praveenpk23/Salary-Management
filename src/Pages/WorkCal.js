import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// Initialize Firebase
const firebaseConfig = {
  // Add your Firebase configuration here
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

const WorkCal = () => {
  const [selectedFamilyName, setSelectedFamilyName] = useState("");
  const [workDetails, setWorkDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = firestore
      .collection("workDetails")
      .where("familyName", "==", selectedFamilyName)
      .onSnapshot(
        (snapshot) => {
          setLoading(false);
          setWorkDetails(snapshot.docs);
        },
        (error) => {
          setLoading(false);
          setError(error);
        }
      );

    // Unsubscribe from snapshot listener when component unmounts
    return () => {
      unsubscribe();
    };
  }, [selectedFamilyName]);

  const handleFamilyNameChange = (event) => {
    setSelectedFamilyName(event.target.value);
  };

  const handlePayBtnClick = (workDetail) => {
    // Rest of the code for handling payment
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Work Details Page</h1>
      <select value={selectedFamilyName} onChange={handleFamilyNameChange}>
        <option value="">Select Family Name</option>
        {/* Render the family names from the work details */}
        {workDetails?.map((doc) => (
          <option key={doc.id} value={doc.data().familyName}>
            {doc.data().familyName}
          </option>
        ))}
      </select>
      {workDetails?.length > 0 && (
        <div>
          <h2>Work Details</h2>
          {/* Render the work details for the selected family name */}
          {workDetails?.map((doc) => (
            <div key={doc.id}>
              <p>Family Name: {doc.data().familyName}</p>
              <p>Remaining Bricks: {doc.data().remainingBricks}</p>
              <p>Salary: {doc.data().salary}</p>
              {doc.data().status !== "paid" && doc.data().daysWorked >= 6 && (
                <button onClick={() => handlePayBtnClick(doc)}>
                  Pay
                </button>
              )}
              {doc.data().status !== "paid" && doc.data().daysWorked < 6 && (
                <p>Need to complete 6 days of work to be eligible for payment</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkCal;
