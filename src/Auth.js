



import React, { useState ,useEffect} from 'react';
import firebase from 'firebase/compat/app';
import { useNavigate , Link, Navigate} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CardFooter from '../components/Footer';
import Card from '@material-ui/core/Card';
import { CardContent } from '@mui/material';
const App = () => {
  useEffect(() => {
    document.body.style.backgroundColor = '#23232323';

    // Clean up the style when the component unmounts
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);
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
  const firestore = firebase.firestore();
  
  const [mobile, setMobile] = useState('');
  const [uid, setUid] = useState(null);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendOtp, setResendOtp] = useState(false);
  const [changeNumber, setChangeNumber] = useState(false);
  const navigate = useNavigate();
  const [resendCountdown, setResendCountdown] = useState(30);

 

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile') {
      setMobile(value);
    } else if (name === 'otp') {
      setOtp(value);
    }
  };


  const onSignInSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    const phoneNumber = '+91' + mobile;
    const usersRef = firebase.firestore().collection('auth');
  
    if (changeNumber) {
      setChangeNumber(false);
      setIsLoading(false);
    } else {
      usersRef
        .where('mobile', '==', mobile)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            toast.error('Account not found for this mobile number.');
            setIsLoading(false);
          } else {
            const appVerifier = window.recaptchaVerifier;
            firebase
              .auth()
              .signInWithPhoneNumber(phoneNumber, appVerifier)
              .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                setOtpSent(true);
                setIsLoading(false);
                toast.success('OTP has been sent successfully.');
              })
              .catch((error) => {
                console.log('SMS not sent:', error);
                toast.error('SMS not sent. Please try again later.');
                setIsLoading(false);
              });
          }
        })
        .catch((error) => {
          console.log('Error checking phone number:', error);
          setIsLoading(false);
        });
    }
  };
  


const onSubmitOTP = (e) => {
  e.preventDefault();
  setIsLoading(true);

  window.confirmationResult
    .confirm(otp)
    .then((result) => {
      const user = result.user;
      const uid = user.uid; // Find UID and store it in a constant
      
      console.log(JSON.stringify(user));
      toast.success('User is verified');
      navigate(`/CHome`);
        localStorage.setItem('DYjks', uid);
       // Include UID in the navigation URL
      // navigate('/Home', { mobile: {mobile}, uid: {uid} })
    })
    .catch((error) => {
      console.log('User couldn\'t sign in (bad verification code?):', error);
      toast.error("Wrong OTP")
      setIsLoading(false);
    });
};


  const handleResendOTP = () => {
    setOtpSent(false);
    setResendOtp(true);
    setChangeNumber(false);
    const phoneNumber = '+91' + mobile; // Define phoneNumber here

    const appVerifier = window.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setIsLoading(false);
        setOtpSent(true);
        setResendOtp(false);
        setChangeNumber(false);
        toast.success('OTP has been resent successfully.');
        setResendCountdown(30);
      })
      .catch((error) => {
        console.log('SMS not sent:', error);
        setIsLoading(false);
      });
      setResendCountdown(30); // Reset countdown
  };

  const handleChangeNumber = () => {
    setOtpSent(false);
    setChangeNumber(true);
    setResendOtp(true);
    setMobile('');
    setResendCountdown(30);
  };

  const configureCaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      size: 'invisible',
      defaultCountry: 'IN'
    });
  };
  useEffect(() => {
    configureCaptcha();
  }, []);
    
  useEffect(() => { 
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown((prevCount) => prevCount - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);


 
  const [isFormVisible, setFormVisible] = useState(false);
  useEffect(() => {
    // Show the form with animation after a delay
    const timeout = setTimeout(() => {
      setFormVisible(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <center>

      <div className="w3-container">
        <br />
        <div className="w3-animate-zoom margin-Log" >
          <ToastContainer />
          <div>
            <Container maxWidth="sm">
              <Grid container spacing={0}>
              
                <Grid item xs={12} sm={12}>
                  <Card className="w3-card sm-Log" >
                    <CardContent>
                      <Typography variant="h5" component="h2" gutterBottom>
                        Client Login
                      </Typography>
                      <form onSubmit={otpSent ? onSubmitOTP : onSignInSubmit}>
                        <div id="sign-in-button"></div>
                        {otpSent?<></>:<TextField
                          type="number"
                          name="mobile"
                          label="Mobile number"
                          placeholder="Mobile number"
                          required
                          value={mobile}
                          onChange={handleChange}
                          fullWidth
                          margin="normal"
                        />}
                        {otpSent && (
                          <TextField
                            type="number"
                            name="otp"
                            label="OTP Number"
                            placeholder="OTP Number"
                            required
                            value={otp}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                          />
                        )}
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          disabled={isLoading}
                          style={{ marginTop: "16px",width:"50%" }}
                        >
                          {isLoading ? "Loading..." : otpSent ? "Submit OTP" : "Send OTP"}
                        </Button>
                        {otpSent && (
                          <div style={{ marginTop: "16px" }}>
                            {resendCountdown === 0 ? (
                              <button variant="text" className='Link' onClick={handleResendOTP}>
                                Resend OTP
                              </button>
                            ) : (
                              <Typography>
                                Resend OTP in {resendCountdown} seconds
                              </Typography>
                            )}
                            <Button
                              variant="text"
                              style={{ width: "70%" }}
                              color="primary"
                              onClick={handleChangeNumber}
                              className='Link'
                            >
                              Change Number
                            </Button>
                          </div>
                        )}
                      </form>
                    </CardContent>
                    <hr />
                    {/* <div className="w3-container w3-center">
                      <Typography variant="body1"  style={{marginBottom:"10px"}}>
                        Don't have an account? <Link to="/ClientReg" className='Link'>Sign up</Link>
                      </Typography>
                    </div> */}
                  </Card>
                </Grid>
             
              </Grid>
            </Container>
          </div>
        </div>
      </div>
      <CardFooter />
    </center>
  );
  
  
  
    
  
  
  
};

export default App;
