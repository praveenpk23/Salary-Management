import React, { useState } from "react";
import firebase from "firebase/compat/app"; 
import "firebase/compat/firestore";
import "firebase/compat/storage"; 
import WorkerList from "./ShowWorker";
import { upload } from "@testing-library/user-event/dist/upload";
import {CircularProgress, Backdrop,Button} from '@mui/material'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Replace the following config with your own Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBLAe1He5yd6hXHs9vyipXWUFiFAQLUye0",
  authDomain: "rvrbrick.firebaseapp.com",
  projectId: "rvrbrick",
  storageBucket: "rvrbrick.appspot.com",
  messagingSenderId: "182259489957",
  appId: "1:182259489957:web:7015f8b5a08c11adf3014c",
  measurementId: "G-Z64Q4BV7PB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

const AddWorker = () => {
  const [familyName, setFamilyName] = useState("");
  const [headName, setHeadName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [photo, setPhoto] = useState(null); // Use null to hold the file object
  const [photoPreview, setPhotoPreview] = useState(""); // Use empty string to hold the photo preview URL
  const [workers, setWorkers] = useState([]); // Define and initialize the workers state with an empty array
  const [isLoading, setIsLoading] = useState(false);


 
  const handleAddWorker = () => {
    setIsLoading(true);
    const storageRef = firebase.storage().ref();
  
    // Check if a photo is selected
    if (photo) {
      const photoRef = storageRef.child(`photos/${photo.name}`);
      photoRef
        .put(photo)
        .then((snapshot) => snapshot.ref.getDownloadURL())
        .then((downloadURL) => {
          addWorkerWithPhoto(downloadURL);
        })
        .catch((error) => {
          toast.error("Error uploading photo: ", error);
          setIsLoading(false);
        });
    } else {
      // No photo selected, add worker data without photo URL
      addWorkerWithPhoto("");
    }
  };
  
  const addWorkerWithPhoto = (photoURL) => {
    db.collection("workers")
      .where("familyName", "==", familyName)
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          toast.warning("Family name already exists. Please choose a different family name.");
          setIsLoading(false);
          return;
        }
  
        db.collection("workers")
          .where("phoneNumber", "==", phoneNumber)
          .get()
          .then((snapshot) => {
            if (!snapshot.empty) {
              toast.warning("Phone number already exists. Please choose a different phone number.");
              setIsLoading(false);
              return;
            }
  
            // Add worker data to Firestore with or without photo URL
            db.collection("workers")
              .add({
                familyName,
                headName,
                phoneNumber,
                photo: photoURL
              })
              .then(() => {
                toast.dark("Worker added successfully!");
                setFamilyName("");
                setHeadName("");
                setPhoneNumber("");
                setPhoto(null);
                setPhotoPreview("");
                setWorkers([
                  ...workers,
                  {
                    familyName,
                    headName,
                    phoneNumber,
                    photo: photoURL
                  }
                ]);
                setIsLoading(false);
              })
              .catch((error) => {
                toast.error("Error adding worker: ", error);
                setIsLoading(false);
              });
          })
          .catch((error) => {
            toast.error("Error checking phone number: ", error);
            setIsLoading(false);
          });
      })
      .catch((error) => {
        toast.error("Error checking family name: ", error);
        setIsLoading(false);
      });
  };
  

   // Function to handle file input change
   const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      // Create a preview URL for the selected file
      const previewURL = URL.createObjectURL(file);
      setPhotoPreview(previewURL);
    } else {
      // Handle case when no file is selected
      setPhoto(null);
      setPhotoPreview(null);
      // Show alert to notify user
      toast.warning('Please select a photo');
    }
  };
  

  const validatePhoneNumber = (number) => {
    const regex = /^[6-9]\d{9}$/; // Indian phone number regex
    return regex.test(number);
  };

  const isFormValid = () => {
    return familyName && headName && validatePhoneNumber(phoneNumber) ;
  };



  return (
    <div className="container">
      <br />
      <div className="row">
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-sm-10 offset-sm-1">
          <h2 className="text-center">Add Worker</h2>
          {/* Render input fields for worker data */}
          <input
            type="text"
            className="form-control mt-3"
            placeholder="Family Name"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            required
          />
          {/* {familyName} */}
          <input
            type="text"
            className="form-control mt-3"
            placeholder="Head Name"
            value={headName}
            onChange={(e) => setHeadName(e.target.value)}
            required
          />
          <input
            type="text"
            className="form-control mt-3"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          {/* Render file input for photo */}
          <input type="file" className="mt-3" onChange={handlePhotoChange} required />
          {/* Render photo preview */}
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Photo Preview"
              className="mt-3"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          )}
          {/* Render add button */}
          <br />
          {/* <center>
            <button
              className="btn btn-primary mt-3"
              onClick={handleAddWorker}
              disabled={!isFormValid() || isLoading} // A
            >
              {isLoading ? "Loading..." : "Click me"}
            </button>
          </center> */}
          <center>
  <Backdrop open={isLoading} style={{ zIndex: 1 }}>
    <CircularProgress color="inherit" />
  </Backdrop>
  <button
    className="btn btn-primary mt-3"
    onClick={handleAddWorker}
    disabled={!isFormValid() || isLoading}
  >
    {isLoading ? 'Loading...' : 'Click me'}
  </button>
</center>

  
          <div className="mt-3"></div>
        </div>
      </div>
      <hr />
      <hr />
      <WorkerList />
    </div>
  );
  

};

export default AddWorker;