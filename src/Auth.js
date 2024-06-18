import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';import { useNavigate } from 'react-router-dom';
import './App.css';  // Ensure this file contains your custom styles.
import Logo from './wfys.png';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
  useEffect(() => {
    document.body.style.backgroundColor = '#23232323';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendOtp, setResendOtp] = useState(false);
  const [resendCountdown, setResendCountdown] = useState();
  const navigate = useNavigate();
  const [changeNumber, setChangeNumber] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) { 
        if (user.phoneNumber) {
          navigate('/DashBord');
        }
      } else {
        navigate('/');
      }
    });
  
    return () => unsubscribe();
  }, []); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile') {
      setMobile(value);
    } else if (name === 'otp') {
      setOtp(value);
    }
  };

  // const onSignInSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   const phoneNumber = '+91' + mobile;
  //   const usersRef = firebase.firestore().collection('Users');

  //   try {
  //     const appVerifier = window.recaptchaVerifier;
  //     const confirmationResult = await firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier);

  //     window.confirmationResult = confirmationResult;
  //     setOtpSent(true);
  //     setIsLoading(false);
  //     toast.success('OTP has been sent successfully.');
  //     setResendCountdown(30);
  //   } catch (error) {
  //     console.log('SMS not sent:', error);
  //     toast.error('SMS not sent. Check the number and try again.');
  //     setIsLoading(false);
  //   }
  // };

  const onSignInSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    const phoneNumber = '+91' + mobile;
    const usersRef = firebase.firestore().collection('Users');
  
    try {
      // Check if the user document exists
      const userDoc = await usersRef.doc(mobile).get();
      if (userDoc.exists) {
        // Proceed with sending OTP
        const appVerifier = window.recaptchaVerifier;
        const confirmationResult = await firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier);
  
        window.confirmationResult = confirmationResult;
        setOtpSent(true);
        setIsLoading(false);
        toast.success('OTP has been sent successfully.');
        setResendCountdown(30);
      } else {
        // User document does not exist
        toast.error('Number not found in our records.');
        setIsLoading(false);
      }
    } catch (error) {
      console.log('Error in sending OTP:', error);
      toast.error('SMS not sent. Check the number and try again.');
      setIsLoading(false);
    }
  };
  
  const onSubmitOTP = (e) => {
    e.preventDefault();
    setIsLoading(true);

    window.confirmationResult
      .confirm(otp)
      .then(async (result) => {
        const user = result.user;
        const phoneNumber = user.phoneNumber.slice(3);

        try {
          const usersRef = firebase.firestore().collection('Users');
          const userDoc = await usersRef.doc(phoneNumber).get();

          if (userDoc.exists) {
            navigate('/DashBord');
          } else {
            await usersRef.doc(phoneNumber).set({
              Mobile: phoneNumber,
            });

            navigate('/DashBord');
          }
        } catch (error) {
          console.error('Error checking phone number:', error);
        }
      })
      .catch((error) => {
        console.log('User couldn\'t sign in (bad verification code?):', error);
        toast.error('Wrong Verification Code!!!');
        setIsLoading(false);
      });
  };

  const handleResendOTP = () => {
    setOtpSent(false);
    setResendOtp(true);
    const phoneNumber = '+91' + mobile;

    const appVerifier = window.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setIsLoading(false);
        setOtpSent(true);
        alert('OTP has been resent successfully.');
        setResendCountdown(30);
        setResendOtp(false);
      })
      .catch((error) => {
        console.log('SMS not sent:', error);
        setIsLoading(false);
      });
      setResendCountdown(30); 
  };

  const handleChangeNumber = () => {
    setOtpSent(false);
    setMobile('');
    setResendCountdown(0);
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
    const timeout = setTimeout(() => {
      setFormVisible(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);
  
  return(
    <>
    <Toaster />
    <div className="login-container">
        <div className="login-box">
          <center><img src={Logo} alt="Logo" className="logo" />
          <h3>Salary management</h3>
          </center>
          <form onSubmit={otpSent ? onSubmitOTP : onSignInSubmit}>
            <div id="sign-in-button"></div>
            {otpSent ? (
              <input
                type="number"
                name="otp"
                placeholder="OTP Number"
                required
                value={otp}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <input
                type="number"
                name="mobile"
                placeholder="Mobile number"
                required
                value={mobile}
                onChange={handleChange}
                className="input-field"
              />
            )}
            <button
              type="submit"
              disabled={isLoading || resendOtp}
              className="submit-button"
            >
              {isLoading ? 'Loading...' : otpSent ? 'Submit OTP' : 'Send OTP'}
            </button>
            {otpSent && (
              <div className="otp-options">
                {resendCountdown === 0 ? (
                  <button onClick={handleResendOTP} className="resend-button">
                    Resend OTP
                  </button>
                ) : (
                  <p className="resend-timer">
                    Resend OTP in {resendCountdown} seconds
                  </p>
                )}
                {/* <button onClick={handleChangeNumber} className="change-number-button">
                  Change Number
                </button> */}
              </div>
            )}
          </form>
        </div>
      </div>
    </>
    );
};

export default Login;
