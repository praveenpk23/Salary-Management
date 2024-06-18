import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import CircularProgress from '@mui/material/CircularProgress';
import { LinearProgress } from '@mui/material';
// Define fetchPayouts function outside of the component
const fetchPayouts = async (setPayouts) => {
  const db = firebase.firestore();
  const payoutsRef = db.collection('payouts');
  const querySnapshot = await payoutsRef.get();
  const payoutsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  setPayouts(payoutsData);
};

const PayoutsPage = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch payouts data from Firebase Firestore
    fetchPayouts(setPayouts);

    // Set up real-time listener for updates
    const db = firebase.firestore();
    const payoutsRef = db.collection('payouts');

    // Listen for real-time updates
    const unsubscribe = payoutsRef.onSnapshot((querySnapshot) => {
      const payoutsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPayouts(payoutsData);
      setLoading(false);
    });

    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    // Delete payout data from Firebase Firestore
    const db = firebase.firestore();
    const payoutsRef = db.collection('payouts');
    await payoutsRef.doc(id).delete();
    // Fetch updated payouts data
    fetchPayouts(setPayouts);
  };

  return (
   <div>
    {loading?(<div style={{marginTop:'1%'}}>
    <center>
      <LinearProgress disableShrink color='inherit' />
    </center>
    </div>):(
       <div className="container mt-4">
        <center>
        <h1>Payouts</h1>
        </center>
       <div className="table-responsive">
         <table className="table table-bordered table-hover">
           <thead className="thead-dark">
             <tr>
               <th>Daily Work Data</th>
               <th>Days Worked</th>
               <th>Family Name</th>
               <th>Status</th>
               <th>Total Bricks</th>
               <th>Total Salary</th>
               <th>Pay Date</th>
             </tr>
           </thead>
           <tbody>
             {payouts.map((data) => (
               <tr key={data.id}>
                 <td>
                   <ul>
                     {data.dailyWorkData?data.dailyWorkData.map((work, index) => (
                       <li key={index}>
                         Work {work.bricksCount}= Date: {work.date},  Bricks: {work.remainingBricks}, Salary: {work.salary}
                       </li>
                     )):""}
                   </ul>
                 </td>
             <td>{data.numberOfDays}</td>
                 <td>{data.familyName}</td>
                 <td
                   style={{
                     color: data.status === 'paid' ? 'green' : 'red',
                   }}
                 >
                   {data.status}
                 </td>
                 <td>{data.totalBricks}</td>
                 <td>{data.totalSalary}</td>
                 <td>{data.payDate}</td>
                 <td>
                   {data.status === 'pending' && (
                     <button
                       className="btn btn-danger"
                       onClick={() => handleDelete(data.id)}
                       style={{
                         display: 'inline',
                       }}
                     >
                       Delete
                     </button>
                   )}
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     </div>
    )}
   </div>
  );
};

export default PayoutsPage;
