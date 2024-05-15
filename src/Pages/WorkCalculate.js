


import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Dropdown, Button } from 'react-bootstrap';
import PayoutsPage from './PayoutsPage';
// Initialize Firebase app with your Firebase configuration
const firebaseConfig = {
  // Your Firebase configuration goes here
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

const WorkCalculate = () => {
  const [workDetails, setWorkDetails] = useState([]);
  const [selectedFamilyName, setSelectedFamilyName] = useState('');
  const [totalBricks, setTotalBricks] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);
  const [workDates, setWorkDates] = useState([]);

  useEffect(() => {
    // Fetch workDetails data from Firestore and update state
    const fetchWorkDetails = async () => {
      try {
        const querySnapshot = await db.collection('workDetails').orderBy('date').get();
        const workDetailsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setWorkDetails(workDetailsData);
      } catch (error) {
        console.error('Error fetching workDetails:', error);
      }
    };
    fetchWorkDetails();
  }, []);

  const handleFamilyNameSelect = (familyName) => {
    // Update selectedFamilyName, reset totalBricks and totalSalary, and get workDates
    setSelectedFamilyName(familyName);
    setTotalBricks(0);
    setTotalSalary(0);
    const filteredWorkDetails = workDetails.filter(work => work.familyName === familyName);
    const dates = filteredWorkDetails.slice(0, 6).map(work => work.date); // Update to slice first 6 works
    setWorkDates(dates);
  
    // Check if the family name has been paid and exclude it from the list of available options
    const isPaid = workDetails.some(work => work.familyName === familyName && work.status === 'paid');
    if (isPaid) {
      const remainingFamilyNames = [...new Set(workDetails.map(work => work.familyName).filter(name => !name.paid))];
      setSelectedFamilyName(remainingFamilyNames[0] || '');
    }
  
    // Calculate totalBricks and totalSalary for the selected family name, excluding works with status "paid"
    const totalBricks = filteredWorkDetails.filter(work => work.status !== 'paid').slice(0, 6).reduce((acc, work) => acc + work.remainingBricks, 0); // Update to consider first 6 works
    const totalSalary = filteredWorkDetails.filter(work => work.status !== 'paid').slice(0, 6).reduce((acc, work) => acc + work.salary, 0); // Update to consider first 6 works
    setTotalBricks(totalBricks);
    setTotalSalary(totalSalary);
  
    // Count number of works with status "pending"
    const pendingWorksCount = filteredWorkDetails.filter(work => work.status === 'pending').length;
    console.log(`Number of pending works: ${pendingWorksCount}`);
  };
  
  


  
//   const handlePayBtnClick = async () => {
//     try {
//       // Calculate totalBricks and totalSalary for selectedFamilyName, excluding works with "status: 'paid'"
//       const filteredWorkDetails = workDetails.filter(
//         work => work.familyName === selectedFamilyName && work.status !== 'paid'
//       );
//       const totalBricks = filteredWorkDetails.reduce((acc, work) => acc + work.remainingBricks, 0);
//       const totalSalary = filteredWorkDetails.reduce((acc, work) => acc + work.salary, 0);
//       setTotalBricks(totalBricks);
//       setTotalSalary(totalSalary);
  
//       // Update workDetails collection in Firestore with "status" field set to "paid" for first 6 pending works
//       const batch = db.batch();
//       let paidWorkCount = 0;
//       filteredWorkDetails.forEach(work => {
//         if (work.status === 'pending' && paidWorkCount < 6) {
//           const workDocRef = db.collection('workDetails').doc(work.id);
//           const updateData = {
//             status: 'paid'
//           };
//           batch.update(workDocRef, updateData);
//           paidWorkCount++;
//         }
//       });
  
//         await batch.commit();

//         // Create a payout document in Firestore
//         const payoutDocRef = await db.collection('payouts').add({
//             familyName: selectedFamilyName,
//             dateFrom: workDates[0],
//             dateTo: workDates[workDates.length - 1],
//             totalBricks,
//             totalSalary,
//             status: 'paid'
//         });

//         console.log('Payout document created with ID:', payoutDocRef.id);
//         alert('Payment done successfully');

//         // Update available family names state after marking a family name as paid
//         const remainingFamilyNames = [...new Set(workDetails.map(work => work.familyName).filter(name => !workDetails.some(work => work.familyName === name && work.paid)))];
//         setSelectedFamilyName(remainingFamilyNames[0] || '');

//     } catch (error) {
//         console.error('Error creating payout:', error);
//     }
// };

// const handlePayBtnClick = async () => {
//   try {
//     // Calculate totalBricks and totalSalary for selectedFamilyName, excluding works with "status: 'paid'"
//     const filteredWorkDetails = workDetails.filter(
//       work => work.familyName === selectedFamilyName && work.status !== 'paid'
//     );
//     const totalBricks = filteredWorkDetails.reduce((acc, work, index) => {
//       if (index < 6) {
//         return acc + work.remainingBricks;
//       } else {
//         return acc;
//       }
//     }, 0);
//     const totalSalary = filteredWorkDetails.reduce((acc, work, index) => {
//       if (index < 6) {
//         return acc + work.salary;
//       } else {
//         return acc;
//       }
//     }, 0);
//     setTotalBricks(totalBricks);
//     setTotalSalary(totalSalary);

//     // Update workDetails collection in Firestore with "status" field set to "paid" for first 6 pending works
//     const batch = db.batch();
//     let paidWorkCount = 0;
//     filteredWorkDetails.forEach(work => {
//       if (work.status === 'pending' && paidWorkCount < 6) {
//         const workDocRef = db.collection('workDetails').doc(work.id);
//         const updateData = {
//           status: 'paid'
//         };
//         batch.update(workDocRef, updateData);
//         paidWorkCount++;
//       }
//     });

//     await batch.commit();

//     // Create a payout document in Firestore
//     const payoutDocRef = await db.collection('payouts').add({
//       familyName: selectedFamilyName,
//       dateFrom: workDates[0],
//       dateTo: workDates[Math.min(workDates.length - 1, 6)], // Update to use first 6 workDates
//       totalBricks,
//       totalSalary,
//       status: 'paid'
//     });

//     console.log('Payout document created with ID:', payoutDocRef.id);
//     alert('Payment done successfully');
//     setTotalBricks("");
//     setTotalSalary("");
//     setWorkDates("");
    
//     // Update available family names state after marking a family name as paid
//     const remainingFamilyNames = [...new Set(workDetails.map(work => work.familyName).filter(name => !workDetails.some(work => work.familyName === name && work.paid)))];
//     setSelectedFamilyName(remainingFamilyNames[0] || '');

//   } catch (error) {
//     console.error('Error updating workDetails:', error);
//   }
// };

const handlePayClick = (familyName) => {
  setLoader(true);
  const filteredWorkDetails = workDetails.filter((work) => work.familyName === familyName && work.status === 'pending');

  if (filteredWorkDetails.length === 0) {
    return;
  }

  const batch = writeBatch(db);
  const payoutDocRef = doc(collection(db, 'payouts'));

  // Get the dates of the first 6 works to be paid
  const workDates = filteredWorkDetails.slice(0, 6).map((work) => new Date(work.date));
  
  const startDate = workDates[0].toLocaleDateString('en-US');
  const endDate = workDates[Math.min(workDates.length - 1, 6)].toLocaleDateString('en-US');

  const totalSalary = filteredWorkDetails.reduce((acc, work) => acc + work.salary, 0);
  const totalBricks = filteredWorkDetails.reduce((acc, work) => acc + work.remainingBricks, 0);

  batch.set(payoutDocRef, {
    dateFrom: startDate,
    dateTo: endDate,
    familyName,
    status: 'paid',
    totalBricks,
    totalSalary
  });

  filteredWorkDetails.forEach((work) => {
    const workDocRef = doc(collection(db, 'workDetails'), work.id);
    batch.update(workDocRef, { status: 'paid' });
  });

  batch.commit()
    .then(() => {
      console.log('Work status updated successfully and payouts stored!');
      setLoader(false);
    })
    .catch((error) => {
      console.error('Error updating work status and storing payouts: ', error);
      setLoader(false);
    });
};
  
  

const getDaysWorked = () => {
  const filteredWorkDetails = workDetails.filter(work => work.familyName === selectedFamilyName && work.status !== 'paid');
  return filteredWorkDetails.length;
};


  // Render component JSX
 // Render component JSX
return  (
<center>
  <br /><br />
<div>
    {/* Render family name select options */}
    <Dropdown>
      <Dropdown.Toggle variant="primary" id="familyNameDropdown">
        Select Family Name
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {[...new Set(workDetails.map(work => work.familyName))].map(familyName => (
          <Dropdown.Item key={familyName} value={familyName} onClick={() => handleFamilyNameSelect(familyName)}>
            {familyName}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>

    {/* Render selected family name and work details */}
    {selectedFamilyName && (
      <div>
        <h2>Selected Family Name: {selectedFamilyName}</h2>
        <p>Total Bricks: {totalBricks}</p>
        <p>Total Salary: {totalSalary}</p>
        <p>Days Worked: {getDaysWorked()}</p>
        {getDaysWorked() < 6 ? (
          <p>Need to finish 6 days to get paid</p>
        ) : (
          <div>
            <p>Days Worked: {Math.min(getDaysWorked(), 6)}</p>
            {getDaysWorked() >= 6 && (
              <div>
                <p>Payment for 6 days ready</p>
                {!workDetails.some(work => work.familyName === selectedFamilyName && work.paid) && (
                  <Button variant="success" onClick={handlePayBtnClick}>
                    Pay
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    )}
  </div>
  <PayoutsPage />
</center>

);



};

export default WorkCalculate;

