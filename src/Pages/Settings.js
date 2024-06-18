// import React, { useState, useEffect } from "react";
// import { Container, Form, Button } from "react-bootstrap";
// import firebase from "firebase/compat/app";
// import "firebase/compat/firestore";
// import "firebase/auth";
// import "firebase/compat/database";
// import "firebase/compat/storage";

// const SettingPage = () => {
//   const [deductionRatioNumerator, setDeductionRatioNumerator] = useState("");
//   const [brickPrice, setBrickPrice] = useState("");
//   const [currentDeductions, setCurrentDeductions] = useState("");
//   const [currentPrice, setCurrentPrice] = useState("");
//   const [deductionRatioDenominator, setDeductionRatioDenominator] = useState({currentPrice});
//   const [updating, setUpdating] = useState(false);

//   useEffect(() => {
//     // Fetch the current brick rates from Firebase and set the state
//     const fetchBrickRates = async () => {
//       try {
//         const doc = await firebase.firestore().collection("bricksrates").doc("settings").get();
//         if (doc.exists) {
//           const data = doc.data();
//           setDeductionRatioDenominator(data.deductionRatioDenominator)
//           setDeductionRatioNumerator(data.deductionRatioNumerator)
//          setBrickPrice(data.brickPrice)
//           setCurrentDeductions(`${data.deductionRatioNumerator}:${data.deductionRatioDenominator}`);
//         }
//       } catch (error) {
//         console.error("Error fetching brick rates:", error);
//       }
//     };
//     fetchBrickRates();
//   }, []);

// const handleUpdate = async () => {
//   try {
//     setUpdating(true);
//     // Update the brick rates in Firebase
//     await firebase.firestore().collection("bricksrates").doc("settings").set({
//       deductionRatioNumerator,
//       deductionRatioDenominator,
//       brickPrice
//     });
//     setCurrentDeductions(`${deductionRatioNumerator}:${deductionRatioDenominator}`);
//     setCurrentPrice(brickPrice);
//     setBrickPrice(brickPrice); // Set brickPrice back to input field
//   } catch (error) {
//     console.error("Error updating brick rates:", error);
//   } finally {
//     setUpdating(false);
//   }
// };

//   const ShowBricks = 1000;
//   const ShoeRate = ShowBricks * currentPrice;
//   const Cp = currentPrice ;
//   return (

// <center>
// <Container>
//       <h1>Setting Page</h1>


//         <Form style={{width:"30%"}}>
//   <Form.Group controlId="deductionRatioNumerator">
//     <Form.Label>Deduction Ratio Numerator</Form.Label>
//     <Form.Control
//       type="number"
//       placeholder="Enter deduction ratio numerator"
//       value={deductionRatioNumerator}
//       onChange={(e) => setDeductionRatioNumerator(e.target.value)}
//     />
//   </Form.Group>
//   <Form.Group controlId="deductionRatioDenominator">
//     <Form.Label>Deduction Ratio Denominator</Form.Label>
//     <Form.Control
//       type="number"
//       placeholder="Enter deduction ratio denominator"
//       value={deductionRatioDenominator}
//       onChange={(e) => setDeductionRatioDenominator(e.target.value)}
//     />
//   </Form.Group>
//   <Form.Group controlId="brickPrice">
//     <Form.Label>Brick Price</Form.Label>
//     <Form.Control
//       type="number"
//       placeholder="Enter brick price"
//         value={brickPrice}
//       onChange={(e) => setBrickPrice(e.target.value)}
//     />
//     <br />
//   </Form.Group>
//   <Button variant="primary" onClick={handleUpdate} disabled={updating}>
//     {updating ? "Updating..." : "Update"}
//   </Button>
// </Form>

//         <br />


//       <h2>Current Deductions: {currentDeductions}</h2>
//       <h2>Current Price: {currentPrice}</h2>
//       <br />
//          <h4>Salary</h4>
//          <h4 > {ShowBricks} Bricks {ShoeRate} rupees</h4>
//     </Container>
// </center>
//   );
// };

// export default SettingPage;




import React, { useState, useEffect } from "react";
import { CircularProgress,Backdrop } from "@mui/material";
import { Container, Form, Button } from "react-bootstrap";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/auth";
import "firebase/compat/database";
import "firebase/compat/storage";
import '../App.css'
import Account from './Account'
const SettingPage = () => {
  const [deductionRatioNumerator, setDeductionRatioNumerator] = useState("");
  const [brickPrice, setBrickPrice] = useState("");
  const [currentDeductions, setCurrentDeductions] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [deductionRatioDenominator, setDeductionRatioDenominator] = useState("");
  const [updating, setUpdating] = useState(false);
  const[Loading,setLoading]=useState(true);
  // useEffect(() => {
  //   // Fetch the current brick rates from Firebase and set the state
  //   const fetchBrickRates = async () => {
  //     try {
  //       const doc = await firebase.firestore().collection("bricksrates").doc("settings").get();
  //       if (doc.exists) {
  //         const data = doc.data();
  //         setDeductionRatioDenominator(data.deductionRatioDenominator);
  //         setDeductionRatioNumerator(data.deductionRatioNumerator);
  //         setBrickPrice(data.brickPrice);
  //         setCurrentDeductions(`${data.deductionRatioNumerator}:${data.deductionRatioDenominator}`);
  //         setCurrentPrice(data.brickPrice);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching brick rates:", error);
  //     }
  //   };
  //   fetchBrickRates();
  // }, []);

  useEffect(() => {
    const unsubscribe = firebase.firestore().collection("bricksrates").doc("settings")
      .onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data();
          setDeductionRatioDenominator(data.deductionRatioDenominator);
          setDeductionRatioNumerator(data.deductionRatioNumerator);
          setBrickPrice(data.brickPrice);
          setCurrentDeductions(`${data.deductionRatioNumerator}:${data.deductionRatioDenominator}`);
          setCurrentPrice(data.brickPrice);
          setLoading(false);
        }
      }, (error) => {
        console.error("Error fetching brick rates:", error);
      });
  
    return () => {
      unsubscribe();
    };
  }, []);
  

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      // Update the brick rates in Firebase
      await firebase.firestore().collection("bricksrates").doc("settings").set({
        deductionRatioNumerator,
        deductionRatioDenominator,
        brickPrice
      });
      setCurrentDeductions(`${deductionRatioNumerator}:${deductionRatioDenominator}`);
      setCurrentPrice(brickPrice);
      setBrickPrice(brickPrice); // Set brickPrice back to input field
    } catch (error) {
      console.error("Error updating brick rates:", error);
    } finally {
      setUpdating(false);
    }
  };

  const ShowBricks = 1000;
  const ShoeRate = ShowBricks * currentPrice;
  const Cp = currentPrice;

  // const handleLocalStorageClear = () => {
  //   const confirmed = window.confirm('Are you sure you want to logout?');
  //   if (confirmed) {
  //     localStorage.removeItem('DYjks');
  //     window.location.reload(); // Refresh the page
  //   }
  // };
  return (
    <center>

      <br />
         
       {/* <button className="btn btn-danger" onClick={handleLocalStorageClear}>Logout</button> */}
       <Account />
       <br/>
       <hr/>
     {Loading?(<div style={{marginTop:"18%"}}>
      <center>
      <CircularProgress color="inherit" />    
      </center>
     </div>):(
       <Container>
       <h1>Settings</h1>
       <Form style={{ width: "30%" }}>
         <Form.Group controlId="deductionRatioNumerator">
           <Form.Label>Deduction Ratio Numerator</Form.Label>
           <Form.Control
             type="number"
             placeholder="Enter deduction ratio numerator"
             value={deductionRatioNumerator}
             onChange={(e) => setDeductionRatioNumerator(e.target.value)}
             className="wi"
           />
         </Form.Group>
         <Form.Group controlId="deductionRatioDenominator">
           <Form.Label>Deduction Ratio Denominator</Form.Label>
           <Form.Control
             type="number"
             className="wi"
             placeholder="Enter deduction ratio denominator"
             value={deductionRatioDenominator}
             onChange={(e) => setDeductionRatioDenominator(e.target.value)}
           />
         </Form.Group>
         <Form.Group controlId="brickPrice">
           <Form.Label>Brick Price</Form.Label>
           <Form.Control
             type="number"
             placeholder="Enter brick price"
             value={brickPrice}
             onChange={(e) => setBrickPrice(e.target.value)}
             className="wi"
           />
           <br />
         </Form.Group>
         <Button variant="primary" onClick={handleUpdate} disabled={updating}>
           {updating ? "Updating..." : "Update"}
         </Button>
          <Backdrop open={updating} style={{ zIndex: 1 }}>
          <CircularProgress color="inherit" />
          </Backdrop>
       </Form>
       <br />
       <h2>Current Deductions: {currentDeductions}</h2>
       <h2>Current Price: {currentPrice}</h2>
       <br />
       <h4>Salary</h4>
       <h4>{ShowBricks} Bricks {ShoeRate} rupees</h4>
       <br />
       <br />
       <hr />
    
     </Container>
     )}
    </center>
  );
};

export default SettingPage;
