import React, { useState } from 'react';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

// Initialize Firebase
const firebaseConfig = {
  // Add your Firebase config here
  apiKey: "AIzaSyBLAe1He5yd6hXHs9vyipXWUFiFAQLUye0",

  authDomain: "rvrbrick.firebaseapp.com",

  projectId: "rvrbrick",

  storageBucket: "rvrbrick.appspot.com",

  messagingSenderId: "182259489957",

  appId: "1:182259489957:web:7015f8b5a08c11adf3014c",

  measurementId: "G-Z64Q4BV7PB"

};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const IPAddressForm = () => {
  const [ipAddress, setIpAddress] = useState('');

  const fetchIPAddress = async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      const { ip } = response.data;
      setIpAddress(ip);
    } catch (error) {
      console.error('Error fetching IP address:', error);
    }
  };

  const saveIPAddress = () => {
    if (ipAddress) {
      db.collection('ipAddresses')
        .add({ ipAddress })
        .then(() => {
          console.log('IP address saved successfully!');
        })
        .catch((error) => {
          console.error('Error saving IP address:', error);
        });
    }
  };

  return (
    <div>
      <button onClick={fetchIPAddress}>Fetch IP Address</button>
      {ipAddress && (
        <div>
          <p>Current IP Address: {ipAddress}</p>
          <button onClick={saveIPAddress}>Save IP Address to Firestore</button>
        </div>
      )}
    </div>
  );
};

export default IPAddressForm;
