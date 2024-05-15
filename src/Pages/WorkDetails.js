import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import ShowWork from './ShowWork';
import { useNavigate } from 'react-router-dom';
import '../App.css'
import { hover } from '@testing-library/user-event/dist/hover';
import { Autocomplete, TextField,Backdrop,CircularProgress } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const WorkDetailsPage = (props) => {
  const [date, setDate] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [bricksCount, setBricksCount] = useState('');
  const [deductionRatioNumerator, setDeductionRatioNumerator] = useState('');
  const [deductionRatioDenominator, setDeductionRatioDenominator] = useState('');
  const [brickPrice, setBrickPrice] = useState('');
  const [remainingBricks, setRemainingBricks] = useState('');
  const [salary, setSalary] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const navigations = useNavigate()



  // Fetch bricks rate from Firestore collection
  // useEffect(() => {
  //   const fetchBrickRate = async () => {
  //     try {
  //       const snapshot = await firebase.firestore().collection('bricksrates').doc('settings').get();
  //       const bricksRateData = snapshot.data();
  //       if (bricksRateData) {
  //         setDeductionRatioNumerator(bricksRateData.deductionRatioNumerator);
  //         setDeductionRatioDenominator(bricksRateData.deductionRatioDenominator);
  //         setBrickPrice(bricksRateData.brickPrice);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching brick rate:', error); 
  //     }
  //   };
  //   fetchBrickRate();
  // }, []);

  useEffect(() => {
    const unsubscribe = firebase.firestore().collection('bricksrates').doc('settings')
      .onSnapshot((snapshot) => {
        const bricksRateData = snapshot.data();
        if (bricksRateData) {
          setDeductionRatioNumerator(bricksRateData.deductionRatioNumerator);
          setDeductionRatioDenominator(bricksRateData.deductionRatioDenominator);
          setBrickPrice(bricksRateData.brickPrice);
        }
      }, (error) => {
        console.error('Error fetching brick rate:', error);
      });
  
    return () => {
      unsubscribe();
    };
  }, []);
  
const handleFamilyNameBlur = async () => {
  try {
    // Fetch family names from workers collection in the Firestore database
    const workersCollection = await firebase.firestore().collection("workers").get();
    const existingFamilyNames = workersCollection.docs.map((doc) => doc.data().familyName);



    // Check if entered family name is in the existing family names array
const filteredFamilyNames = existingFamilyNames.filter(
  (name) => name.toLowerCase() === familyName.toLowerCase()
);

if (filteredFamilyNames.length === 0) {
  toast.error("Please enter a valid family name from the workers database.");

  setFamilyName(""); // Clear the invalid family name from input field
  setSuggestions(existingFamilyNames); // Set suggestions to existing family names
  return;
}

// Fetch suggestions base   d on entered family name
const filteredSuggestions = existingFamilyNames.filter(
(name) => name.toLowerCase().indexOf(familyName.toLowerCase()) === 0
);
setSuggestions(filteredSuggestions);
  } catch (error) {
    toast.error("Error fetching family names from Firestore: ", error);
  }
};
  
  // JSX for displaying suggestions as dropdown menu
  
  

  // Calculate remaining bricks and salary based on inputs
  useEffect(() => {
    const remainingBricks = bricksCount - (bricksCount * deductionRatioNumerator / deductionRatioDenominator);
    setRemainingBricks(remainingBricks);
    const salary = remainingBricks * brickPrice;
    setSalary(salary);
  }, [bricksCount, deductionRatioNumerator, deductionRatioDenominator, brickPrice]);

  const handleBricksCountChange = (e) => {
    setBricksCount(e.target.value);
  };
  

  
//   const handleAddWorkDetails = () => {
//     // Check if required fields are empty
//     if (!date || !familyName || !bricksCount || !deductionRatioNumerator || !deductionRatioDenominator || !brickPrice || !remainingBricks || !salary) {
//         alert('Please fill in all the required fields.');
//         return;
//     }
//     setIsLoading(true);

//     // Check if work details already exist in Firestore collection
//     const existingWorkDetails = firebase.firestore().collection('workDetails').where('familyName', '==', familyName).where('date', '==', date);
//     existingWorkDetails.get()
//         .then((querySnapshot) => {
//             if (!querySnapshot.empty) {
//                 alert('Work details already exist for the given family name and date. Please delete and add again instead.');
//                 setIsLoading(false);
//             } else {
//                 // Check if family has 6 pending works
//                 const pendingWorkDetails = firebase.firestore().collection('workDetails').where('familyName', '==', familyName).where('status', '==', 'pending');
//                 pendingWorkDetails.get()
//                     .then((querySnapshot) => {
//                         if (querySnapshot.size === 6) {
//                             alert('Family already has 6 pending works. Cannot add new work details.');
//                             setIsLoading(false);
//                         } else {
//                             // Add work details to Firestore collection
//                             const workDetails = {
//                                 date: date,
//                                 familyName: familyName,
//                                 bricksCount: bricksCount,
//                                 deductionRatioNumerator: deductionRatioNumerator,
//                                 deductionRatioDenominator: deductionRatioDenominator,
//                                 brickPrice: brickPrice,
//                                 remainingBricks: remainingBricks,
//                                 salary: salary,
//                                 status: "pending",
//                             };
//                             firebase.firestore().collection('workDetails').add(workDetails)
//                                 .then(() => {
//                                     alert('Work details added successfully');
//                                     setDate("");
//                                     setFamilyName("");
//                                     setBricksCount("");
//                                     setIsLoading(false);
//                                 })
//                                 .catch((error) => {
//                                     alert('Error adding work details:', error);
//                                     setIsLoading(false);
//                                 });
//                         }
//                     })
//                     .catch((error) => {
//                         alert('Error checking pending works:', error);
//                         setIsLoading(false);
//                     });
//             }
//         })
//         .catch((error) => {
//             alert('Error checking existing work details:', error);
//             setIsLoading(false);
//         });
// };

const handleAddWorkDetails = () => {
  // Check if required fields are empty
  if (
    !date ||
    !familyName ||
    !bricksCount ||
    !deductionRatioNumerator ||
    !deductionRatioDenominator ||
    !brickPrice ||
    !remainingBricks ||
    !salary
  ) {
    toast.error('Please fill in all the required fields.');
    return;
  }
  setIsLoading(true);

  // Format the date
const formattedDate = new Date(date);
const day = String(formattedDate.getDate()).padStart(2, '0');
const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
const year = formattedDate.getFullYear();
const formattedDateString = `${day}-${month}-${year}`;


  // Check if work details already exist in Firestore collection
  const existingWorkDetails = firebase
    .firestore()
    .collection('workDetails')
    .where('familyName', '==', familyName)
    .where('date', '==', formattedDateString);
  existingWorkDetails
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        toast.warning('Work details already exist for the given family name and date. Please delete and add again instead.');
        setIsLoading(false);
      } else {
        // Check if family has 6 pending works
        const pendingWorkDetails = firebase
          .firestore()
          .collection('workDetails')
          .where('familyName', '==', familyName)
          .where('status', '==', 'pending');

        pendingWorkDetails
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.size === 6) {
              toast.error('Family already has 6 pending works. Cannot add new work details.');
              setIsLoading(false);
            } else {
              // Add work details to Firestore collection
              const workDetails = {
                date: formattedDateString,
                familyName: familyName,
                bricksCount: bricksCount,
                deductionRatioNumerator: deductionRatioNumerator,
                deductionRatioDenominator: deductionRatioDenominator,
                brickPrice: brickPrice,
                remainingBricks: remainingBricks,
                salary: salary,
                status: 'pending',
              };
              firebase
                .firestore()
                .collection('workDetails')
                .add(workDetails)
                .then(() => {
                  toast.dark('Work details added successfully');
                  setDate('');
                  setFamilyName('');
                  setBricksCount('');
                  setIsLoading(false);
                })
                .catch((error) => {
                  toast.error('Error adding work details:', error);
                  setIsLoading(false);
                });
            }
          })
          .catch((error) => {
            toast.error('Error checking pending works:', error);
            setIsLoading(false);
          });
      }
    })
    .catch((error) => {
      toast.error('Error checking existing work details:', error);
      setIsLoading(false);
    });
};
const handleSuggestionClick = (suggestion) => {
  setFamilyName(suggestion);
  setSuggestions([]); // Clear the suggestions after selecting one
  };
  const [familyNames, setFamilyNames] = useState([]);
const db = firebase.firestore();
  useEffect(() => {
    const fetchFamilyNames = async () => {
      const querySnapshot = await getDocs(collection(db, 'workers'));
      const names = querySnapshot.docs.map((doc) => doc.data().familyName);
      setFamilyNames(names);
    };
    fetchFamilyNames();
  }, []);
const ShowRate = 1000*brickPrice;
return (
   <center>
    <br />
     <div>
      <h1>{props.title}</h1>
<form>
      {/* <label htmlFor="Date">Date:</label> */}
      <br />
  <TextField
    type="date"
    className=" wi"
    value={date}
    placeholder='Enter Date'
    onChange={(e) => setDate(e.target.value)}
    required
  />
<br />
  {/* <label htmlFor="familyName">Family Name:</label> */}
  <br />
  {/* <input
    type="text"
    id="familyName"
    name="familyName"
    value={familyName}
    placeholder='Enter Family Name'
    onChange={(e) => setFamilyName(e.target.value)}
    onBlur={handleFamilyNameBlur}
    className="form-control wi"
    style={{ width: "", display: "inline" }}
    required
  /> */}
    <Autocomplete
      disablePortal
      options={familyNames}
      required
      className='wi'
      value={familyName}
      onChange={(event, newValue) => setFamilyName(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Family Name"
          variant="outlined"
        />
      )}
    />
{/* Render suggestions based on entered family name */}
{/* { suggestions.length > 0 && (
  <div>
    { suggestions.map((suggestion, index) => (
      <div
        key={index}
        className="suggestion-item wi"
        style={{
          cursor: "pointer",
          color: "white",
          padding: "10px",
          backgroundColor:"#232323"
          // Add additional styles for non-hover state
        }}
        onMouseEnter={(event) => {
          event.target.style.backgroundColor = "lightgreen";
          event.target.style.color = "black";

          // Add additional styles for hover state
        }}
        onMouseLeave={(event) => {
          event.target.style.backgroundColor = "#232323";
          event.target.style.color = "white";

          // Remove hover styles
        }}
        onClick={() => handleSuggestionClick(suggestion)}
      >
        {suggestion}
      </div>
    ))}
  </div>
)} */}
  {/* <label htmlFor="bricksCount">Bricks Count:</label> */}
  <br />
  <TextField
    type="number"
    id="bricksCount"
    name="bricksCount"
    value={bricksCount}
    placeholder='Enter Bricks Count'
    onChange={handleBricksCountChange}
    className=" wi"
    required
  />
  <br />
  <p className="lead">Remaining Bricks: {remainingBricks}</p>
  <p className="lead">Salary: {salary}</p>
 <center>
 <Backdrop open={isLoading} style={{ zIndex: 1 }}>
    <CircularProgress color="inherit" />
  </Backdrop>
  <button
    type="button"
    className="btn btn-dark"
    onClick={handleAddWorkDetails}
    disabled={isLoading}
  >
    {isLoading ? "Loading..." : "Add Work Details"}
  </button>
 </center>
</form>
      <br />
      <div>
    <div>
      <center>
      <div className="card lead" style={{width:"28rem"}} >
  <div className="card-body">
    <h1 className="card-title">Rates and Ratio</h1>
    <h4 className="card-subtitle mb-2 text-muted">current data</h4>
    <h3>
    <p>       For every : {deductionRatioDenominator}  brick's   </p>
    <p>    Deduction :{deductionRatioNumerator}  brick</p>
    <p>        price : {brickPrice} brick   </p>
    <p>1000 bricks cutting salary is {ShowRate}</p>
    </h3>
    <button style={{marginLeft:"70%"}} className=' btn ' onClick={()=>{navigations("/settings")}}> <i className="bi bi-search"></i>Change</button>
  </div>
</div>
      </center>
    </div>
      </div>
      <center>
      <div>
        <ShowWork />
      </div>
   </center>
    </div>
        <ToastContainer />
   </center>
  );
};
export default WorkDetailsPage;