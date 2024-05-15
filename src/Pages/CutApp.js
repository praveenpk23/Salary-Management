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


import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddWorker from '../Pages/AddWorker';
import SettingPage from '../Pages/Settings';
import WorkDetailsPage from './WorkDetails';
import ShowWork from './ShowWork';
import WorkCalculator from '../WorkCalculator';
import PayoutsPage from './PayoutsPage';
import MySidebar from './MySidebar';
import NoInternet from './NoInternet';
import Navbar from './NavBar';

function CutApp() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatusChange = () => setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  return (
    <div>
      <div className="">
        <BrowserRouter>
          <Navbar />
          <br />
          <MySidebar />
          <br />
          {isOnline ? (
            <Routes>
              <Route path="/" element={<WorkDetailsPage title='Work Details' /> }  />
              <Route path="/settings" element={<SettingPage />} />
              <Route path="/AddWorker" element={<AddWorker />} />
              <Route path="/showwork" element={<ShowWork title='Show Work' />} />
              <Route path="/workcalculate" element={<WorkCalculator />} />
              <Route path="/payoutspage" element={<PayoutsPage />} />
            </Routes>
          ) : (
            <NoInternet />
          )}
        </BrowserRouter>
        <br />
        {/* <WorkCal /> */}
        <br />
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
