// import React from 'react';
// import { Routes, Route, BrowserRouter } from 'react-router-dom';
// import AddWorker from '../Pages/AddWorker';
// import SettingPage from '../Pages/Settings';
// import WorkDetailsPage from './WorkDetails';
// import ShowWork from './ShowWork';
// import WorkCalculator from '../WorkCalculator';
// import PayoutsPage from './PayoutsPage';
// import MySidebar from './MySidebar';
// import NoInternet from './NoInternet'; // Import the "No Internet" component
// import Navbar from './NavBar';

// function CutApp() {
//   const isOnline = navigator.onLine; // Check for internet connectivity

//   return (
   
//     <div>
//     <div className=''>
//       <BrowserRouter>
//       <Navbar />
//       <br />
//         <MySidebar />
//         <br />
//        {isOnline?(
//          <Routes>
          
//          <Route path="/" element={<WorkDetailsPage />} />
//          <Route path="/settings" element={<SettingPage />} />
//          <Route path="/AddWorker" element={<AddWorker />} />
//          <Route path="/showwork" element={<ShowWork />} />
//          <Route path="/workcalculate" element={<WorkCalculator />} />
//          <Route path="/payoutspage" element={<PayoutsPage />} />
//        </Routes>
//        ):(
//         <NoInternet />
//        )}
//       </BrowserRouter>
//       <br />
//       {/* <WorkCal /> */}
//       <br />
//     </div>
  
// </div>
//   );
// }

// export default CutApp;


// import React, { useState, useEffect } from 'react';
// import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import AddWorker from '../Pages/AddWorker';
// import SettingPage from '../Pages/Settings';
// import WorkDetailsPage from './WorkDetails';
// import ShowWork from './ShowWork';
// import WorkCalculator from '../WorkCalculator';
// import PayoutsPage from './PayoutsPage';
// import MySidebar from './MySidebar';
// import NoInternet from './NoInternet';
// import Navbar from './NavBar';

// function CutApp() {
//   const [isOnline, setIsOnline] = useState(navigator.onLine);

//   useEffect(() => {
//     const handleOnlineStatusChange = () => setIsOnline(navigator.onLine);

//     window.addEventListener('online', handleOnlineStatusChange);
//     window.addEventListener('offline', handleOnlineStatusChange);

//     return () => {
//       window.removeEventListener('online', handleOnlineStatusChange);
//       window.removeEventListener('offline', handleOnlineStatusChange);
//     };
//   }, []);

//   return (
//     <div>
//       <div className="">
//         <BrowserRouter>
//           <Navbar />
//           <br />
//           <MySidebar />
//           <br />
//           {isOnline ? (
//             <Routes>
//               <Route path="/" element={<WorkDetailsPage title='Work Details' /> }  />
//               <Route path="/settings" element={<SettingPage />} />
//               <Route path="/AddWorker" element={<AddWorker />} />
//               <Route path="/showwork" element={<ShowWork title='Show Work' />} />
//               <Route path="/workcalculate" element={<WorkCalculator />} />
//               <Route path="/payoutspage" element={<PayoutsPage />} />
//             </Routes>
//           ) : (
//             <NoInternet />
//           )}
//         </BrowserRouter>
//         <br />
//         {/* <WorkCal /> */}
//         <br />
//       </div>
//     </div>
//   );
// }

// export default CutApp;



// import React, { useState, useEffect } from 'react';
// import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
// import firebase from 'firebase/compat/app'; // Import Firebase
// import 'firebase/compat/auth'; // Import Firebase Auth
// import 'firebase/compat/firestore'; // Import Firestore
// import AddWorker from '../Pages/AddWorker';
// import SettingPage from '../Pages/Settings';
// import WorkDetailsPage from './WorkDetails';
// import ShowWork from './ShowWork';
// import WorkCalculator from '../WorkCalculator';
// import PayoutsPage from './PayoutsPage';
// import MySidebar from './MySidebar';
// import NoInternet from './NoInternet';
// import Navbar from './NavBar';
// import { CircularProgress } from '@mui/material';

// function CutApp() {
//   const [isOnline, setIsOnline] = useState(navigator.onLine);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const navigate = useNavigate(); // Initialize navigate

//   useEffect(() => {
//     const handleOnlineStatusChange = () => setIsOnline(navigator.onLine);

//     window.addEventListener('online', handleOnlineStatusChange);
//     window.addEventListener('offline', handleOnlineStatusChange);

//     return () => {
//       window.removeEventListener('online', handleOnlineStatusChange);
//       window.removeEventListener('offline', handleOnlineStatusChange);
//     };
//   }, []);

//   useEffect(() => {
//     const checkAuthAndMobile = async () => {
//       try {
//         firebase.auth().onAuthStateChanged(async (user) => {
//           if (user && user.phoneNumber) {
//             // Extract mobile number without country code
//             const mobileNumberWithoutCode = user.phoneNumber.slice(3);
//             const userDocRef = firebase.firestore().collection('Users').doc(mobileNumberWithoutCode);
//             const userDoc = await userDocRef.get();

//             if (userDoc.exists) {
//               setIsAuthenticated(true); // Mobile number exists in the collection
//             } else {
//               // Sign out and navigate back if the mobile number is not found or formatted incorrectly
//               await firebase.auth().signOut();
//               navigate(-1); // Navigate back
//             }
//           } else {
//             // If no user is authenticated, sign out just in case
//             await firebase.auth().signOut();
//             navigate(-1); // Navigate back
//           }
//         });
//       } catch (error) {
//         console.error("Error checking user authentication or mobile number:", error);
//         // Sign out and navigate back on error
//         await firebase.auth().signOut();
//         navigate(-1); // Navigate back
//       }
//     };

//     checkAuthAndMobile();
//   }, [navigate]); // Only run once on component mount

//   return (
//     <div>
//       <div>
//           <Navbar />
//           <br />
//           {/* <MySidebar /> */}
//           <br />
//           {isOnline ? (
//             isAuthenticated ? (
//               <Routes>
//                 <Route path="/" element={<WorkDetailsPage title='Work Details' />} />
//                 <Route path="/settings" element={<SettingPage />} />
//                 <Route path="/AddWorker" element={<AddWorker />} />
//                 <Route path="/showwork" element={<ShowWork title='Show Work' />} />
//                 <Route path="/workcalculate" element={<WorkCalculator />} />
//                 <Route path="/payoutspage" element={<PayoutsPage />} />
//               </Routes>
//             ) : (
//               <center>
//                               <div style={{marginTop:"200px"}}><CircularProgress /></div> 
//                 </center>
//             )
//           ) : (
//             <NoInternet />
//           )}
//         <br />
//       </div>
//     </div>
//   );
// }

// export default CutApp;


import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app'; // Import Firebase
import 'firebase/compat/auth'; // Import Firebase Auth
import 'firebase/compat/firestore'; // Import Firestore
import AddWorker from '../Pages/AddWorker';
import SettingPage from '../Pages/Settings';
import WorkDetailsPage from './WorkDetails';
import ShowWork from './ShowWork';
import WorkCalculator from '../WorkCalculator';
import PayoutsPage from './PayoutsPage';
import MySidebar from './MySidebar';
import NoInternet from './NoInternet';
import Navbar from './NavBar';
import { CircularProgress } from '@mui/material';

function CutApp() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userStatus, setUserStatus] = useState(null); // State to store user status
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const handleOnlineStatusChange = () => setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  useEffect(() => {
    const checkAuthAndMobile = async () => {
      try {
        firebase.auth().onAuthStateChanged(async (user) => {
          if (user && user.phoneNumber) {
            // Extract mobile number without country code
            const mobileNumberWithoutCode = user.phoneNumber.slice(3);
            const userDocRef = firebase.firestore().collection('Users').doc(mobileNumberWithoutCode);
            const userDoc = await userDocRef.get();

            if (userDoc.exists) {
              setIsAuthenticated(true); // Mobile number exists in the collection
              const userData = userDoc.data();
              setUserStatus(userData.Status); // Set user status

              // Check if Expire_Date is in the past and status is not already "Expired"
              const { Expire_Date } = userData;
              const expireDate = Expire_Date.toDate(); // Convert Firestore timestamp to Date object
              const today = new Date();

              if (expireDate < today && userData.Status !== 'Expired') {
                // Update status to "Expired" in Users collection
                await userDocRef.update({
                  Status: 'Expired',
                  expiredAt: firebase.firestore.Timestamp.now() // Optionally, you can update the expiredAt timestamp
                });
              }
            } else {
              // Sign out and navigate back if the mobile number is not found or formatted incorrectly
              await firebase.auth().signOut();
              navigate(-1); // Navigate back
            }
          } else {
            // If no user is authenticated, sign out just in case
            await firebase.auth().signOut();
            navigate(-1); // Navigate back
          }
        });
      } catch (error) {
        console.error("Error checking user authentication or mobile number:", error);
        // Sign out and navigate back on error
        await firebase.auth().signOut();
        navigate(-1); // Navigate back
      }
    };

    checkAuthAndMobile();
  }, [navigate]); // Only run once on component mount

  return (
    <div>
      <Navbar />
      <br />
      <div>
        {isOnline ? (
          isAuthenticated ? (
            <>
              {userStatus === 'Expired' ? (
                <div className="expired-status-message">
                  <h1>🚫 Your Free Trial Has Expired 🚫</h1>
                  <p>Your free trial has ended. If you wish to continue, please contact support.</p>
                  <p>Contact: support@example.com</p>
                </div>
              ) : (
                <Routes>
                  <Route path="/" element={<WorkDetailsPage title='Work Details' />} />
                  <Route path="/settings" element={<SettingPage />} />
                  <Route path="/AddWorker" element={<AddWorker />} />
                  <Route path="/showwork" element={<ShowWork title='Show Work' />} />
                  <Route path="/workcalculate" element={<WorkCalculator />} />
                  <Route path="/payoutspage" element={<PayoutsPage />} />
                </Routes>
              )}
            </>
          ) : (
            <center>
              <div style={{ marginTop: "200px" }}>
                <CircularProgress />
              </div>
            </center>
          )
        ) : (
          <NoInternet />
        )}
      </div>
    </div>
  );
}

export default CutApp;


  // import React from 'react';
  // import { Routes, Route, BrowserRouter } from 'react-router-dom';
  // import AddWorker from '../Pages/AddWorker';
  // import SettingPage from '../Pages/Settings';
  // import WorkDetailsPage from './WorkDetails';
  // import ShowWork from './ShowWork';
  // import WorkCalculator from '../WorkCalculator';
  // import PayoutsPage from './PayoutsPage';
  // import MySidebar from './MySidebar';
  // import NoInternet from './NoInternet';
  // import Navbar from './NavBar';

  // function CutApp() {
  //   const [isOnline, setIsOnline] = React.useState(navigator.onLine); // Check for initial internet connectivity

  //   React.useEffect(() => {
  //     const handleOnline = () => setIsOnline(true); // Internet connection is restored
  //     const handleOffline = () => setIsOnline(false); // Internet connection is lost

  //     window.addEventListener('online', handleOnline);
  //     window.addEventListener('offline', handleOffline);
    
  //   }, []);

  //   return (
  //     <div>
  //       {isOnline ? (
  //         <div className=''>
  //           <BrowserRouter>
  //             <Navbar />
  //             <br />
  //             <MySidebar />
  //             <br />
  //             <Routes>
  //               <Route path="/" element={<WorkDetailsPage />} />
  //               <Route path="/settings" element={<SettingPage />} />
  //               <Route path="/AddWorker" element={<AddWorker />} />
  //               <Route path="/showwork" element={<ShowWork />} />
  //               <Route path="/workcalculate" element={<WorkCalculator />} />
  //               <Route path="/payoutspage" element={<PayoutsPage />} />
  //             </Routes>
  //           </BrowserRouter>
  //           <br />
  //         </div>
  //       ) : (
  //         <NoInternet />
  //       )}
  //     </div>
  //   );
  // }

  // export default CutApp;
