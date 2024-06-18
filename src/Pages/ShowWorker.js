// Import necessary libraries
import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import CircularProgress from '@mui/material/CircularProgress';
// import LinearProgress from '@mui/material/LinearProgress';


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

const WorkerList = () => {
  const [workers, setWorkers] = useState([]);
  const [editWorkerId, setEditWorkerId] = useState(null);
  const [familyName, setFamilyName] = useState("");
  const [headName, setHeadName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // Fetch workers data from Firestore
  //   const unsubscribe = db.collection("workers").onSnapshot((querySnapshot) => {
  //     const workerData = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setWorkers(workerData);
  //     setLoading(false); // Set loading state to false when data is fetched
  //   });

  //   // Unsubscribe from real-time updates when the component unmounts
  //   return () => unsubscribe();
  // }, []);
  useEffect(() => {
    const unsubscribe = db.collection("workers").onSnapshot((querySnapshot) => {
      const workerData = [];
      querySnapshot.forEach((doc) => {
        workerData.push({ id: doc.id, ...doc.data() });
      });
      setWorkers(workerData);
      setLoading(false);
    });
  
    return unsubscribe; // Unsubscribe from real-time updates when the component unmounts
  }, []);
  

  const handleEditWorker = (worker) => {
    // Set data of selected worker to input fields for editing
    setEditWorkerId(worker.id);
    setFamilyName(worker.familyName);
    setHeadName(worker.headName);
    setPhoneNumber(worker.phoneNumber);
  };

 
  // const handleUpdateWorker = (worker) => {
  //   if (familyName === worker.familyName) {
  //     // Family name is the same, no need to update
  //     setFamilyName("");
  //     setHeadName("");
  //     setPhoneNumber("");
  //     setEditWorkerId(null);
  //     return;
  //   }
  
  //   const batch = db.batch();
  
  //   // Update worker data in "workers" collection
  //   const workerRef = db.collection("workers").doc(worker.id);
  //   workerRef.update(workerRef, {
  //     familyName: familyName,
  //     headName: headName,
  //     phoneNumber: phoneNumber,
  //   });
  
  //   // Update worker data in "payouts" collection
  //   const payoutsRef = db.collection("payouts").where("familyName", "==", worker.familyName);
  //   payoutsRef.get().then((snapshot) => {
  //     snapshot.forEach((doc) => {
  //       const payoutRef = db.collection("payouts").doc(doc.id);
  //       batch.update(payoutRef, { familyName: familyName });
  //     });
  
  //     // Update worker data in "workDetails" collection
  //     const workDetailsRef = db.collection("workDetails").where("familyName", "==", worker.familyName);
  //     workDetailsRef.get().then((snapshot) => {
  //       snapshot.forEach((doc) => {
  //         const workDetailRef = db.collection("workDetails").doc(doc.id);
  //         batch.update(workDetailRef, { familyName: familyName });
  //       });
  
  //       batch
  //         .commit()
  //         .then(() => {
  //           alert("Worker updated successfully!");
  
  //           const updatedWorkers = workers.map((w) =>
  //             w.id === worker.id ? { ...w, familyName, headName, phoneNumber } : w
  //           );
  //           setWorkers(updatedWorkers);
  
  //           setFamilyName("");
  //           setHeadName("");
  //           setPhoneNumber("");
  //           setEditWorkerId(null);
  //         })
  //         .catch((error) => {
  //           alert("Error updating worker: " + error);
  //         });
  //     });
  //   });
  // };
  
  const handleUpdateWorker = (worker) => {
    if (familyName === worker.familyName && headName === worker.headName && phoneNumber === worker.phoneNumber) {
      // Family name, head name, and phone number are the same, no need to update
      setFamilyName("");
      setHeadName("");
      setPhoneNumber("");
      setEditWorkerId(null);
      return;
    }
  
    // Update worker data in "workers" collection
    db.collection("workers")
      .doc(worker.id)
      .update({
        familyName: familyName,
        headName: headName,
        phoneNumber: phoneNumber,
      })
      .then(() => {
        alert("Worker updated successfully!");
  
        const updatedWorkers = workers.map((w) =>
          w.id === worker.id ? { ...w, familyName, headName, phoneNumber } : w
        );
        setWorkers(updatedWorkers);
  
        setFamilyName("");
        setHeadName("");
        setPhoneNumber("");
        setEditWorkerId(null);
      })
      .catch((error) => {
        alert("Error updating worker: " + error);
      });
  
    // Update worker data in "payouts" collection
    db.collection("payouts")
      .where("familyName", "==", worker.familyName)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const payoutRef = db.collection("payouts").doc(doc.id);
          payoutRef.update({ familyName: familyName });
        });
      })
      .catch((error) => {
        console.error("Error updating payouts:", error);
      });
  
    // Update worker data in "workDetails" collection
    db.collection("workDetails")
      .where("familyName", "==", worker.familyName)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const workDetailRef = db.collection("workDetails").doc(doc.id);
          workDetailRef.update({ familyName: familyName });
        });
      })
      .catch((error) => {
        console.error("Error updating workDetails:", error);
      });
  };
  

  

  const handleDeleteWorker = (workerId) => {
    // Delete worker data from Firestore
    db.collection("workers")
      .doc(workerId)
      .delete()
      .then(() => {
        // alert("Worker deleted successfully!");
        // Update the component state by removing the deleted worker data
        const updatedWorkers = workers.filter((worker) => worker.id !== workerId);
        setWorkers(updatedWorkers);
        // Reset input fields and edit mode after successful delete
        setFamilyName("");
        setHeadName("");
        setPhoneNumber("");
        setEditWorkerId(null);
      })
      .catch((error) => {
        alert("Error deleting worker: ", error);
      });
  };

  return (
    <div>
      {loading?(<center>
        <CircularProgress  color="inherit"/>
      </center>):(
        <div className="container mt-5">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <h2 className="text-center">Worker List</h2>
            <table className="table-responsive mt-3">
              <thead>
                <tr style={{margin:"20px"}}>
                  <th>Photo</th>
                  <th>Family Name</th>
                  <th>Head Name</th>
                  <th>Phone Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody style={{width:"100%"}}>
                {workers.map((worker) => (
                  <tr key={worker.id}>
                    <td>
                      <div className="rounded-circle overflow-hidden" style={{ width: "40px", height: "40px" }}>
                      {worker.photo ? (
  <img
    src={worker.photo}
    alt="Worker"
    className="w-100 h-100 object-cover"
    style={{ borderRadius: "50%" }}
  />
) : (
  <div
    className="w-100 h-100 d-flex justify-content-center align-items-center"
    style={{ backgroundColor: "black", color: "white", borderRadius: "50%" }}
  >
    <span style={{ fontSize: "20px" }}>{worker.familyName.charAt(0)}</span>
  </div>
)}

                      </div>
                    </td>
                    <td>
                      {editWorkerId === worker.id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={familyName}
                          onChange={(e) => setFamilyName(e.target.value)}
                        />
                      ) : (
                        worker.familyName
                      )}
                    </td>
                    <td>
                      {editWorkerId === worker.id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={headName}
                          onChange={(e) => setHeadName(e.target.value)}
                        />
                      ) : (
                        worker.headName
                      )}
                    </td>
                    
                    <td>
                      {editWorkerId === worker.id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      ) : (
                        worker.phoneNumber
                      )}
                    </td>
                    
                    <td>
                      <div className="d-flex align-items-center">
                        {editWorkerId === worker.id ? (
                          <div>
                            <button
                              className="btn btn-primary btn-sm mr-2"
                              onClick={() => handleUpdateWorker(worker)}
                            >
                              Update
                            </button>
                            <br /><br />
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete this worker?")) {
                                  handleDeleteWorker(worker.id);
                                }
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        ) : (
                          <div>
                            <button
                              className="btn btn-primary btn-sm mr-2"
                              onClick={() => handleEditWorker(worker)}
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}
    </div>
  );
  
  };
export default WorkerList;  