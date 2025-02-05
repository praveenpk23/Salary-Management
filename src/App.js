

// import React, { useState, useEffect } from 'react';
// import './App.css';
// import CutApp from './Pages/CutApp';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
// import firebase from "firebase/compat/app";
// import "firebase/compat/firestore";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faKey } from "@fortawesome/free-solid-svg-icons";


// // Initialize Firebase
// const firebaseConfig = {
//   // Replace with your Firebase configuration
//   apiKey: "AIzaSyBLAe1He5yd6hXHs9vyipXWUFiFAQLUye0",
//   authDomain: "rvrbrick.firebaseapp.com",
//   projectId: "rvrbrick",
//   storageBucket: "rvrbrick.appspot.com",
//   messagingSenderId: "182259489957",
//   appId: "1:182259489957:web:7015f8b5a08c11adf3014c",
//   measurementId: "G-Z64Q4BV7PB"
// };

// firebase.initializeApp(firebaseConfig);
// const firestore = firebase.firestore();

//   function App() {
//     const [showFullScreenPopup, setShowFullScreenPopup] = useState(true); // State to track if the fullscreen popup should be shown
//     const [showCutApp, setShowCutApp] = useState(false); // State to track if the CutApp component should be shown
//     const [pin, setPin] = useState(""); // State to track the entered PIN
//     const [wrongPin, setWrongPin] = useState(false); // State to track if wrong PIN was entered
//     const [passcode, setPasscode] = useState("");
//     const [nointernet, setNoInternet] = useState(false);
//     const [showPasscode, setShowPasscode] = useState(false);
//     const [keyIconColor, setKeyIconColor] = useState("gray");
//     const [Loader,setLoader] = useState("")

//     const handleKeyClick = () => {
//       setShowPasscode(!showPasscode);
//       setKeyIconColor(showPasscode ? "gray" : "red");
//     };


//   // Simulate checking for internet connection
//   const checkInternetConnection = () => {
//     // Simulate API call or checking for internet connection
//     const isConnected = navigator.onLine;
//     setNoInternet(!isConnected);
//   };

//   useEffect(() => {
//     checkInternetConnection();
//   }, []);
//     useEffect(() => {
//       // Fetch the passcode from Firestore
//       setLoader(true);
//       firestore
//         .collection("passcode")
//         .get()
//         .then((querySnapshot) => {
//           // Get the first document in the collection
//           const doc = querySnapshot.docs[0];

//           // If a document exists, set the passcode state
//           if (doc && doc.exists) {
//             setPasscode(doc.data().passcode);
//             setLoader(false);
//           } else {
//             console.log("No passcode found in Firestore");
//           }
//         })
//         .catch((error) => {
//           console.error("Error fetching document: ", error);
//           setLoader(false);
//         });
//     }, []);

//     useEffect(() => {
//       document.addEventListener('keydown', handleEscKeyPress); // Add event listener for "esc" key
//       document.addEventListener('fullscreenchange', handleFullScreenChange); // Add event listener for fullscreen change

//       return () => {
//         document.removeEventListener('keydown', handleEscKeyPress); // Remove event listener for "esc" key on unmount
//         document.removeEventListener('fullscreenchange', handleFullScreenChange); // Remove event listener for fullscreen change on unmount
//       };
//     }, []);

//     const handleFullScreenButtonClick = () => {
//       setShowFullScreenPopup(false); // Hide the fullscreen popup
//       setShowCutApp(true); // Show the CutApp component
//       requestFullScreen(); // Request fullscreen mode
//     };

//     const requestFullScreen = () => {
//       const elem = document.documentElement;
//       if (elem.requestFullscreen) {
//         elem.requestFullscreen();
//       } else if (elem.mozRequestFullScreen) { // Firefox
//         elem.mozRequestFullScreen();
//       } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
//         elem.webkitRequestFullscreen();
//       } else if (elem.msRequestFullscreen) { // IE/Edge
//         elem.msRequestFullscreen();
//       }
//     };

//     const handleEscKeyPress = (event) => {
//       if (event.keyCode === 27) { // Check if "esc" key is pressed
//         setShowFullScreenPopup(true); // Show the fullscreen popup again
//         setShowCutApp(false); // Hide the CutApp component
//       }
//     };

//     const handleFullScreenChange = () => {
//       if (!document.fullscreenElement) { // Check if fullscreen mode is exited
//         setShowFullScreenPopup(true); // Show the fullscreen popup again
//         setShowCutApp(false); // Hide the CutApp component
//       }
//     };

//     const handlePinChange = (event) => {
//       setPin(event.target.value); // Update the PIN state with the entered value
//     };

//     // const handlePinChange = (event) => {
//     //   setPin(event.target.value);
//     // };
    
//     const handlePinSubmit = () => {
      
//       if (pin === passcode) { // Check if entered PIN is correct
//         setShowFullScreenPopup(false); // Hide the fullscreen popup
//         setShowCutApp(true); // Show the CutApp component
//         requestFullScreen(); // Request fullscreen mode
//         setWrongPin(false); // Reset wrong PIN flag
//         setPin("");
//       } else {
//         setWrongPin(true); // Set wrong PIN flag to true
//         setPin(""); // Clear the entered PIN
//         // alert("Wrong PIN. Please try again."); // Show alert for wrong PIN
//       }
//     };

  
//     return (
//       <div className="" >
//         {showFullScreenPopup && (
//           <div className="container" style={{marginTop:"12%"}}>
//             <div className="row justify-content-center">
//               <div className="col-md-6">
//                 <div className="card">
//                   <div className="card-header bg-dark text-white">
//                     <h3>RVR BRICKS MANAGEMENT</h3>
//                   </div>
//                   <div className="card-body">
//                     <h4 className="card-title">Enter PIN to open</h4>
//                     <br />
//                     <div className="fullscreen-popup">
//                       <div className="form-group">
//                         <div className="input-group">
//                           <input
//                             type={showPasscode ? "text" : "password"}
//                             value={pin}
//                             onChange={handlePinChange}
//                             className="form-control"
//                             placeholder="Enter Pin"
//                           />
//                           <div className="input-group-append">
//                             <span className="input-group-text" style={{ cursor: "pointer" }}>
//                               <FontAwesomeIcon
//                                 icon={faKey}
//                                 size="lg"
//                                 style={{ color: keyIconColor,paddingBottom:"0px",marginTop:"6px" }}
//                                 onClick={handleKeyClick}
//                               />
//                             </span>
//                           </div>
//                         </div>
//                         {wrongPin && <p className="wrong-pin-msg text-danger">Wrong PIN. Please try again.</p>}
//                       </div>
//                       <div className="text-center">
//                         <button
//                           onClick={handlePinSubmit}
//                           disabled={Loader}
//                           className="btn btn-success"
//                           style={{ width: "50%", marginTop: "10px" }}
//                         >
//                           {Loader ? "Loading..." : "Submit"}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
    
//         {!showFullScreenPopup && <CutApp />}
//       </div>
//     );
    
    
//   };

// export default App;





  //////////////////////////////////////////////////////////////////////////
import React, { Component } from 'react';
import CutApp from './Pages/CutApp';
import './App.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  componentDidCatch(error, info) {
    console.log('Error:', error);
    console.log('Info:', info);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return (
       <div style={{marginTop:"15%"}}>
        <center>
        <div>
          <h1>Something went wrong</h1>
          <h2>Please contact Workfys Infotech for assistance</h2>
          <h3>Contact: 9385325892</h3>
        </div>
        </center>
       </div>
      );
    }

    return this.props.children;
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <ErrorBoundary>
          <CutApp />
        </ErrorBoundary>
      </div>
    );
  }
}

export default App;



// apiKey: "AIzaSyBLAe1He5yd6hXHs9vyipXWUFiFAQLUye0",

//       authDomain: "rvrbrick.firebaseapp.com",
    
//       projectId: "rvrbrick",
    
//       storageBucket: "rvrbrick.appspot.com",
    
//       messagingSenderId: "182259489957",
    
//       appId: "1:182259489957:web:7015f8b5a08c11adf3014c",
    
//       measurementId: "G-Z64Q4BV7PB" 


//////////////////////////////////////////////////////////////////////////////
// import React, { useEffect, useState } from 'react';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/firestore';
// import { CircularProgress } from '@mui/material';
// import './App.css';
// import CutApp from '../src/Pages/CutApp';
// import NoInternet from './Pages/NoInternet';
// export default function App() {
//   const [ipAddress, setIpAddress] = useState('');
//   const [hasPermission, setHasPermission] = useState(false);
//   const [isConnected, setIsConnected] = useState(true);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Initialize Firebase
//     const firebaseConfig = {
//       // Your Firebase configuration
//       apiKey: "AIzaSyBLAe1He5yd6hXHs9vyipXWUFiFAQLUye0",

//       authDomain: "rvrbrick.firebaseapp.com",
    
//       projectId: "rvrbrick",
    
//       storageBucket: "rvrbrick.appspot.com",
    
//       messagingSenderId: "182259489957",
    
//       appId: "1:182259489957:web:7015f8b5a08c11adf3014c",
    
//       measurementId: "G-Z64Q4BV7PB" 
//     };

//     firebase.initializeApp(firebaseConfig);
//     const db = firebase.firestore();

//     // Function to retrieve user's IP address
//     const getIpAddress = async () => {
//       try {
//         const response = await fetch('https://api.ipify.org/?format=json');
//         const data = await response.json();
//         setIpAddress(data.ip);
//         console.log(data.ip);
//       } catch (error) {
//         console.log('Error fetching IP address:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     getIpAddress();
//   }, []);


//   useEffect(() => {
//     // Check if IP address matches any field in the Firebase collection
//     const checkIp = async () => {
//       if (ipAddress && ipAddress !== '') {
//         try {
//           const collectionRef = firebase.firestore().collection('ipAddress');
//           const querySnapshot = await collectionRef.where('ip', '==', ipAddress).get();
  
//           if (!querySnapshot.empty) {
//             // IP address found in the collection, grant permission
//             setHasPermission(true);
//           } else {
//             // IP address not found in the collection, deny permission
//             setHasPermission(false);
//           }
//         } catch (error) {
//           console.log('Error checking IP address:', error);
//         }
//       }
//     };
  
//     checkIp();
//   }, [ipAddress]);
  

//   useEffect(() => {
//     // Check for internet connection
//     const checkInternetConnection = () => {
//       const onOnline = () => setIsConnected(true);
//       const onOffline = () => setIsConnected(false);

//       window.addEventListener('online', onOnline);
//       window.addEventListener('offline', onOffline);

//       return () => {
//         window.removeEventListener('online', onOnline);
//         window.removeEventListener('offline', onOffline);
//       };
//     };

//     checkInternetConnection();
//   }, []);

//   return (
//     <div>
//       {isLoading ? (
//         <div className="loading-indicator" style={{marginTop:"18%"}}>
//           <center>
//           <CircularProgress color='success'/>
//           </center>
//         </div>
//       ) : (
//         <div>
//           {isConnected ? (
//             <div>
//               {hasPermission ? (
//                 <CutApp />
//               ) : (
//                 <p>IP Address: {ipAddress}</p>

//               )}
//             </div>
//           ) : (
//             <NoInternet />
//           )}
//         </div>
//       )}
//     </div>
//   );
// }


// import React, { useState, useEffect } from 'react';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth'; // Import the 'auth' module
// import { useNavigate, Link, Navigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Container from "@mui/material/Container";
// import Grid from "@mui/material/Grid";
// import Typography from "@mui/material/Typography";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import Card from '@mui/material/Card';
// import { CardContent } from '@mui/material';
// import CutApp from '../src/Pages/CutApp'
// const App = () => {


//   const firebaseConfig = {
//     // Your Firebase config
//     apiKey: "AIzaSyBLAe1He5yd6hXHs9vyipXWUFiFAQLUye0",

//     authDomain: "rvrbrick.firebaseapp.com",
  
//     projectId: "rvrbrick",
  
//     storageBucket: "rvrbrick.appspot.com",
  
//     messagingSenderId: "182259489957",
  
//     appId: "1:182259489957:web:7015f8b5a08c11adf3014c",
  
//     measurementId: "G-Z64Q4BV7PB"
//   };

//   // Initialize Firebase
//   if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
//   }

//   const [mobile, setMobile] = useState('');
//   const [uid, setUid] = useState(null);
//   const [otp, setOtp] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [resendOtp, setResendOtp] = useState(false);
//   const [changeNumber, setChangeNumber] = useState(false);
//   const [resendCountdown, setResendCountdown] = useState(30);
//   const [user, setUser] = useState(null); // State to store the authenticated user
//   const[Valid,setValid]=useState(false);
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'mobile') {
//       setMobile(value);
//     } else if (name === 'otp') {
//       setOtp(value);
//     }
//   };

//   const handleAuthStateChange = (user) => {
//     if (user) {
//       // User is signed in
//       setUser(user);
//     } else {
//       // User is signed out
//       setUser(null);
//     }
//   };

 
//   // const onSignInSubmit = (e) => {
//   //   e.preventDefault();
//   //   setIsLoading(true);

//   //   const phoneNumber = '+91' + mobile;
//   //   const usersRef = firebase.firestore().collection('auth');

//   //   if (changeNumber) {
//   //     setChangeNumber(false);
//   //     setIsLoading(false);
//   //   } else {
//   //     usersRef
//   //       .where('mobile', '==', mobile)
//   //       .get()
//   //       .then((querySnapshot) => {
//   //         if (querySnapshot.empty) {
//   //           toast.error('Account not found for this mobile number.');
//   //           setIsLoading(false);
//   //         } else {
//   //           const appVerifier = window.recaptchaVerifier;
//   //           firebase
//   //             .auth()
//   //             .signInWithPhoneNumber(phoneNumber, appVerifier)
//   //             .then((confirmationResult) => {
//   //               window.confirmationResult = confirmationResult;
//   //               setOtpSent(true);
//   //               setIsLoading(false);
//   //               toast.success('OTP has been sent successfully.');
//   //             })
//   //             .catch((error) => {
//   //               console.log('SMS not sent:', error);
//   //               toast.error('SMS not sent. Please try again later.');
//   //               setIsLoading(false);
//   //             });
//   //         }
//   //       })
//   //       .catch((error) => {
//   //         console.log('Error checking phone number:', error);
//   //         setIsLoading(false);
//   //       });
//   //   }
//   // };


//   const onSignInSubmit = (e) => {
//     e.preventDefault();
//     setIsLoading(true);
  
//     const phoneNumber = '+91' + mobile;
  
//     if (changeNumber) {
//       setChangeNumber(false);
//       setIsLoading(false);
//     } else {
//       if (mobile === '9385325892'||'9150156156') {
//         const appVerifier = window.recaptchaVerifier;
  
//         firebase
//           .auth()
//           .signInWithPhoneNumber(phoneNumber, appVerifier)
//           .then((confirmationResult) => {
//             window.confirmationResult = confirmationResult;
//             setOtpSent(true);
//             setIsLoading(false);
//             toast.success('OTP has been sent successfully.');
//           })
//           .catch((error) => {
//             console.log('SMS not sent:', error);
//             toast.error('SMS not sent. Please try again later.');
//             setIsLoading(false);
//           });
//       } else {
//         toast.error('Mobile number does not exsist');
//         setIsLoading(false);
//       }
//     }
//   };

//   const onSubmitOTP = (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     window.confirmationResult
//       .confirm(otp)
//       .then((result) => {
//         const user = result.user;
//         const uid = user.uid;
//         console.log(JSON.stringify(user));
//         toast.success('User is verified');
//         setValid(true);
//         localStorage.setItem('DYjks', uid);
//       })
//       .catch((error) => {
//         console.log('User couldn\'t sign in (bad verification code?):', error);
//         toast.error("Wrong OTP");
//         setIsLoading(false);
//         setValid(false);
//       });
//   };

//   const handleResendOTP = () => {
//     setOtpSent(false);
//     setResendOtp(true);
//     setChangeNumber(false);
//     const phoneNumber = '+91' + mobile;

//     const appVerifier = window.recaptchaVerifier;
//     firebase
//       .auth()
//       .signInWithPhoneNumber(phoneNumber, appVerifier)
//       .then((confirmationResult) => {
//         window.confirmationResult = confirmationResult;
//         setIsLoading(false);
//         setOtpSent(true);
//         setResendOtp(false);
//         setChangeNumber(false);
//         toast.success('OTP has been resent successfully.');
//         setResendCountdown(30);
//       })
//       .catch((error) => {
//         console.log('SMS not sent:', error);
//         setIsLoading(false);
//       });
//     setResendCountdown(30); // Reset countdown
//   };

//   const handleChangeNumber = () => {
//     setOtpSent(false);
//     setChangeNumber(true);
//     setResendOtp(true);
//     setMobile('');
//     setResendCountdown(30);
//   };

//   const configureCaptcha = () => {
//     window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
//       size: 'invisible',
//       defaultCountry: 'IN'
//     });
//   };

//   useEffect(() => {
//     configureCaptcha();
//     const val=localStorage.getItem('DYjks');
//     if(val){
//       setValid(true);
//     }
//     else{
//         setValid(false);
//       }
//   }, []);

//   const [isFormVisible, setFormVisible] = useState(false);
//   useEffect(() => {
//     // Show the form with animation after a delay
//     const timeout = setTimeout(() => {
//       setFormVisible(true);
//     }, 500);

//     return () => clearTimeout(timeout);
//   }, []);
//   useEffect(() => { 
//     let timer;
//     if (resendCountdown > 0) {
//       timer = setTimeout(() => {
//         setResendCountdown((prevCount) => prevCount - 1);
//       }, 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [resendCountdown]);

//   return (
//     <center>
//     <div>
//       {Valid ?(
//         <div>
//           <CutApp />
//         </div>
//       ):(
//         <div className="w3-container">
//         <br />
//         <div className="w3-animate-zoom margin-Log">
//           <ToastContainer />
//           <div>
//             <Container maxWidth="sm">
//               <Grid container spacing={0}>
//                 <Grid item xs={12} sm={12}>
//                   <Card className="w3-card sm-Log">
//                     <CardContent>
//                       <Typography variant="h5" component="h2" gutterBottom>
//                         Client Login
//                       </Typography>
                 
//                         <form onSubmit={otpSent ? onSubmitOTP : onSignInSubmit}>
//                           <div id="sign-in-button"></div>
//                           {otpSent ? (
//                             <></>
//                           ) : (
//                             <TextField
//                               type="number"
//                               name="mobile"
//                               label="Mobile number"
//                               placeholder="Mobile number"
//                               required
//                               value={mobile}
//                               onChange={handleChange}
//                               fullWidth
//                               margin="normal"
//                             />
//                           )}
//                           {otpSent && (
//                             <TextField
//                               type="number"
//                               name="otp"
//                               label="OTP Number"
//                               placeholder="OTP Number"
//                               required
//                               value={otp}
//                               onChange={handleChange}
//                               fullWidth
//                               margin="normal"
//                             />
//                           )}
//                           <Button
//                             type="submit"
//                             variant="contained"
//                             color="primary"
//                             disabled={isLoading}
//                             style={{ marginTop: "16px", width: "50%" }}
//                           >
//                             {isLoading ? "Loading..." : otpSent ? "Submit OTP" : "Send OTP"}
//                           </Button>
//                           {otpSent && (
//                             <div style={{ marginTop: "16px" }}>
//                               {resendCountdown === 0 ? (
//                                 <button variant="text" className="Link" onClick={handleResendOTP}>
//                                   Resend OTP
//                                 </button>
//                               ) : (
//                                 <Typography>Resend OTP in {resendCountdown} seconds</Typography>
//                               )}
//                               <Button
//                                 variant="text"
//                                 style={{ width: "70%" }}
//                                 color="primary"
//                                 onClick={handleChangeNumber}
//                                 className="Link"
//                               >
//                                 Change Number
//                               </Button>
//                             </div>
//                           )}
//                         </form>
                  
//                     </CardContent>
//                     {/* <div className="w3-container w3-center">
//                       <Typography variant="body1" style={{ marginBottom: "10px" }}>
//                         Don't have an account? <Link to="/ClientReg" className="Link">Sign up</Link>
//                       </Typography>
//                     </div> */}
//                   </Card>
//                 </Grid>
//               </Grid>
//             </Container>
//           </div>
//         </div>
        
//       </div>
//       )}
//     </div>
//     </center>
//   );
// };

// export default App;


// import CutApp from './Pages/CutApp'
// import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import Auth from './Auth'
// function App(){
//   return(
//     <div>
//       <BrowserRouter>
//         <Routes>
//         {/* <Route path="/" element={<Auth title='Work Details' /> }  /> */}
//         <Route path="/" element={<CutApp title='Work Details' /> }  />

//         </Routes>
//       </BrowserRouter>
//     </div>
//   );
// }

// export  default App;