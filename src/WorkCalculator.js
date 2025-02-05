import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc, query, where, writeBatch ,setDoc} from 'firebase/firestore';
import { db } from './Pages/Firebase';
import CircularProgress from '@mui/material/CircularProgress';
import { LinearProgress,Backdrop } from '@mui/material';
import PayoutsPage from './Pages/PayoutsPage';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-bootstrap';
const  WorkCalculator=()=> {
  const [workDetails, setWorkDetails] = useState([]);
  const[Loader,setLoader]=useState(true);
  // useEffect(() => {
  //   const unsubscribe = onSnapshot(collection(db, 'workDetails'), (snapshot) => {
  //     const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  //     setWorkDetails(data);
  //     setLoader(false);
  //   });
  
  //   return unsubscribe;
  // }, []);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'workDetails'), 
      snapshot => {
        const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setWorkDetails(data);
        setLoader(false);
      }
    );
  
    return unsubscribe;
  }, []);
  

  const calculateTotalSalary = (familyName) => {
    const filteredWorkDetails = workDetails.filter((work) => work.familyName === familyName && work.status === 'pending');

    if (filteredWorkDetails.length === 0) {
      return 0;
    }

    const totalSalary = filteredWorkDetails.reduce((acc, work) => acc + work.salary, 0);
    return totalSalary.toFixed(2);
  };

  const calculateTotalRemainingBricks = (familyName) => {
    const filteredWorkDetails = workDetails.filter((work) => work.familyName === familyName && work.status === 'pending');

    if (filteredWorkDetails.length === 0) {
      return 0;
    }

    const totalRemainingBricks = filteredWorkDetails.reduce((acc, work) => acc + work.remainingBricks, 0);
    return totalRemainingBricks.toFixed(2);
  };


  
//   const handlePayClick = (familyName) => {
//   const result = window.confirm("Are you sure you want to proceed?");
//   if (result) {
//     setLoader(true);
//     const selectedWorks = workDetails.filter((work) => selectedFamilies.includes(work.id));

//     if (selectedWorks.length === 0) {
//       return;
//     }

//     const batch = writeBatch(db);
//     const payoutDocRef = doc(collection(db, 'payouts'));

//     const selectedDates = selectedWorks.map((work) => work.date);
//     const startDate = new Date(Math.min(...selectedDates)).toLocaleDateString('en-GB');
//     const endDate = new Date(Math.max(...selectedDates)).toLocaleDateString('en-GB');
//     const numberOfDays = selectedWorks.length;

//     const totalSalary = selectedWorks.reduce((acc, work) => acc + work.salary, 0);
//     const totalBricks = selectedWorks.reduce((acc, work) => acc + work.remainingBricks, 0);

//     const options = { timeZone: 'Asia/Kolkata', hour12: true }; // Set the time zone to Indian Standard Time (IST) and enable AM/PM format
//     const payDate = new Date().toLocaleString('en-GB', options); // Current date and time in Indian time zone with AM/PM format

//     batch.set(payoutDocRef, {
//       datesOfWork: selectedDates,
//       numberOfDays,
//       familyName,
//       status: 'paid',
//       totalBricks,
//       totalSalary,
//       payDate, // Store the payDate field with Indian time and AM/PM format
//     });

//     selectedWorks.forEach((work) => {
//       const workDocRef = doc(collection(db, 'workDetails'), work.id);
//       batch.update(workDocRef, { status: 'paid', payDate });
//     });

//     batch
//       .commit()
//       .then(() => {
//         console.log('Work status updated successfully and payouts stored!');
//         setLoader(false);
//       })
//       .catch((error) => {
//         console.error('Error updating work status and storing payouts: ', error);
//         setLoader(false);
//       });
//   } else {
//     return false;
//   }
// };

const handlePayClick = (familyName) => {
  const result = window.confirm("Are you sure you want to proceed?");
  if (result) {
    setLoader(true);
    const selectedWorks = workDetails.filter((work) => selectedFamilies.includes(work.id));

    if (selectedWorks.length === 0) {
      return;
    }

    const batch = writeBatch(db);
    const payoutDocRef = doc(collection(db, 'payouts'));

    const selectedDates = selectedWorks.map((work) => work.date);
    const startDate = new Date(Math.min(...selectedDates)).toLocaleDateString('en-GB');
    const endDate = new Date(Math.max(...selectedDates)).toLocaleDateString('en-GB');
    const numberOfDays = selectedWorks.length;

    const totalSalary = selectedWorks.reduce((acc, work) => acc + work.salary, 0);
    const totalBricks = selectedWorks.reduce((acc, work) => acc + work.remainingBricks, 0);

    const options = { timeZone: 'Asia/Kolkata', hour12: true }; // Set the time zone to Indian Standard Time (IST) and enable AM/PM format
    const payDate = new Date().toLocaleString('en-GB', options); // Current date and time in Indian time zone with AM/PM format

    const dailyWorkData = selectedWorks.map((work,index) => ({
      date: work.date,
      familyName: work.familyName,
      bricksCount: index + 1, // Update bricksCount to 1, 2, 3, ...
      remainingBricks: work.remainingBricks,
      salary: work.salary,
    }));

    batch.set(payoutDocRef, {
      startDate,
      endDate,
      numberOfDays,
      familyName,
      status: 'paid',
      totalBricks,
      totalSalary,
      payDate, // Store the payDate field with Indian time and AM/PM format
      dailyWorkData,
    });

    selectedWorks.forEach((work) => {
      const workDocRef = doc(collection(db, 'workDetails'), work.id);
      batch.update(workDocRef, { status: 'paid', payDate });
      toast.success('Paid Successfully')
    });

    batch
      .commit()
      .then(() => {
        console.log('Work status updated successfully and payouts stored!');
        toast.success('Paid Successfully')
        setLoader(false);
      })
      .catch((error) => {
        console.error('Error updating work status and storing payouts: ', error);
        setLoader(false);
      });
  } else {
    return false;
  }
};

  
  const [selectedFamilies, setSelectedFamilies] = useState([]);
  
  const handleFamilySelect = (familyName) => {
    if (selectedFamilies.includes(familyName)) {
      setSelectedFamilies(selectedFamilies.filter((name) => name !== familyName));
    } else {
      setSelectedFamilies([...selectedFamilies, familyName]);
    }
  };
  

  const familiesWithPendingWorks = [...new Set(workDetails.filter(work => work.status === 'pending').map(work => work.familyName))];
  

return(
  

<div>
  <ToastContainer />
  {Loader?(<div style={{marginTop:"18%"}}>
    <center>
    <CircularProgress color='inherit' />
  </center>
  </div>):(
    <div className="container mt-3">
    {familiesWithPendingWorks.map((familyName) => {
      const filteredWorkDetails = workDetails.filter((work) => work.familyName === familyName && work.status === 'pending');
      const daysWorked = filteredWorkDetails.length;
      const allSelected = filteredWorkDetails.every((work) => selectedFamilies.includes(work.id));
      const selectedWorks = filteredWorkDetails.filter((work) => selectedFamilies.includes(work.id));
      const selectedWorksCount = selectedWorks.length;
      const selectedWorksTotalSalary = selectedWorks.reduce((total, work) => total + work.salary, 0);
      const selectedWorksTotalBricks = selectedWorks.reduce((total, work) => total + work.remainingBricks, 0);
  
      // const handleSelectAll = () => {
      //   const selectedWorkIds = selectedFamilies.filter((id) => filteredWorkDetails.find((work) => work.id === id));
      //   if (selectedWorkIds.length === filteredWorkDetails.length) {
      //     setSelectedFamilies(selectedFamilies.filter((id) => !selectedWorkIds.includes(id)));
      //   } else {
      //     setSelectedFamilies([...selectedFamilies, ...filteredWorkDetails.map((work) => work.id)]);
      //   }
      // };
  
      const handleSelectAll = () => {
        const selectedWorkIds = selectedFamilies.filter((id) =>
          filteredWorkDetails.find((work) => work.id === id)
        );
        if (selectedWorkIds.length === filteredWorkDetails.length) {
          setSelectedFamilies([]);
        } else {
          const newSelectedFamilies = filteredWorkDetails.map((work) => work.id);
          setSelectedFamilies(newSelectedFamilies);
        }
      };
      
  
      return (
        <div key={familyName} style={{marginTop:"50px"}}>
          <h2>{familyName}</h2>
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Date</th>
                <th>Total Salary</th>
                <th>Total Remaining Bricks</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkDetails.map((work) => {
                const isSelected = selectedFamilies.includes(work.id);
  
                const handleWorkSelect = () => {
                  if (isSelected) {
                    setSelectedFamilies(selectedFamilies.filter((id) => id !== work.id));
                  } else {
                    setSelectedFamilies([...selectedFamilies, work.id]);
                  }
                };
  
                return (
                  <tr key={work.id}>
                    <td>{work.date}</td>
                    <td>{work.salary}</td>
                    <td>{work.remainingBricks}</td>
                    <td>
                      <center><input type="checkbox" checked={isSelected} onChange={handleWorkSelect} /></center>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredWorkDetails.length > 0 && (
            <div>
              <p>Total Works for <span style={{color:"#232323",backgroundColor:"",fontSize:"20px",cursor:"pointer"}}>{familyName}</span>: {filteredWorkDetails.length}</p>
              <div>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
                <label style={{marginLeft:"10px"}}> Select All</label>
                <hr />
              </div>
              {selectedWorksCount > 0 && (
                <div>
                  <p>Selected Works: {selectedWorksCount}</p>
                  <p>Total Salary for Selected Works: {selectedWorksTotalSalary}</p>
                  <p>Total Bricks for Selected Works: {selectedWorksTotalBricks}</p>
                  <button
                    className="btn btn-success"
                    onClick={() => handlePayClick(familyName)}
                  >
                    Pay Selected
                  </button>
                  <Backdrop open={Loader} style={{ zIndex: 1 }}>
                   <CircularProgress color="inherit" />
                  </Backdrop>
                  <hr />
                </div>
              )}
            </div>
          )}
        </div>
      );
    })}
    <PayoutsPage />
  </div>
  )}
</div>


  );
}



export default WorkCalculator;

