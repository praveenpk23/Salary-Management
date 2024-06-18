import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import './SettingPage.css';

const SettingPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = firebase.auth().currentUser;

        if (user && user.phoneNumber) {
          const mobileNumberWithoutCode = user.phoneNumber.slice(3); // Assuming '+91' country code removal
          const userDocRef = firebase.firestore().collection('Users').doc(mobileNumberWithoutCode);
          const userDoc = await userDocRef.get();

          if (userDoc.exists) {
            setUserData(userDoc.data());
          } else {
            console.error('User document not found');
          }
        } else {
          console.error('No authenticated user found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const calculateDaysLeft = (timestamp) => {
    const expireDate = timestamp.toDate(); // Convert Firestore timestamp to Date object
    const today = new Date();
    const diffTime = expireDate - today; // Calculate difference in milliseconds
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    return diffDays >= 0 ? diffDays : 0; // Return 0 if expired
  };

  const handleLogout = () => {
    firebase.auth().signOut().then(() => {
      window.location.reload(); // Refresh page or redirect to login
    }).catch((error) => {
      console.error('Error during logout:', error);
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No user data found</div>;
  }

  const { Mobile, Status, Expire_Date,Name } = userData;
  const daysLeft = calculateDaysLeft(Expire_Date);

  return (
    <div className="settings-container">
      <div className="user-details">
        <h2>{Name}</h2>
        <p><strong>Mobile Number:</strong> {Mobile}</p>
        <p><strong>Status:</strong> {Status}</p>
        <p><strong>Expire Date:</strong> {Expire_Date.toDate().toLocaleDateString()}</p>
        <p><strong>Days Left:</strong> {daysLeft} day(s)</p>
      </div>
      {Status === 'FreeTrial' && (
        <div className="free-trial-message">
          <h1>🎉 Enjoy your Free Trial! 🎉</h1>
          <p>You have <strong>{daysLeft} day(s)</strong> left to enjoy your free trial.</p>
        </div>
      )}
      {Status === 'Active' && (
        <div className="active-status-message">
          <h1>🌟 Active Membership 🌟</h1>
          <p>Your account is currently active. Keep enjoying our services!</p>
          <p>Expires in <strong>{daysLeft} day(s)</strong>.</p>
        </div>
      )}
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default SettingPage;
