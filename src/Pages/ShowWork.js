import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { CircularProgress } from '@mui/material';
const ShowWork = ({title}) => {
  const [formData, setFormData] = useState([]);
  const[Loading,setLoading]=useState(true)
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const snapshot = await firebase
  //         .firestore()
  //         .collection('workDetails')
  //         .orderBy('date', 'desc')
  //         .get();
  //       const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //       setFormData(data);

  //       firebase
  //         .firestore()
  //         .collection('workDetails')
  //         .orderBy('date', 'desc')
  //         .onSnapshot((snapshot) => {
  //           const updatedData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //           setFormData(updatedData); // Update the formData state with the updated data
  //         });
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    let unsubscribe = null;
  
    const fetchData = async () => {
      try {
        const snapshot = await firebase
          .firestore()
          .collection('workDetails')
          .orderBy('date', 'desc')
          .get();
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setFormData(data);
        setLoading(false);
  
        unsubscribe = firebase
          .firestore()
          .collection('workDetails')
          .orderBy('date', 'desc')
          .onSnapshot((snapshot) => {
            const updatedData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setFormData(updatedData);
          });
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
    
    return () => {
      // Unsubscribe from the Firestore snapshot listener
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);
  
  const handleDelete = async (id) => {
    // Display a confirmation dialog
    const confirmDelete = window.confirm('Are you sure you want to delete this document?');

    // If user confirms deletion
    if (confirmDelete) {
      try {
        // Delete the document from Firestore
        await firebase.firestore().collection('workDetails').doc(id).delete();

        // Update the state to reflect the deletion
        setFormData(formData.filter((data) => data.id !== id));

        console.log('Document deleted successfully.');
      } catch (error) {
        console.error(error);
      }
    }
  };
  const separateByFamilyName = (data) => {
    const separatedData = {};
    data.forEach((item) => {
      if (!separatedData[item.familyName]) {
        separatedData[item.familyName] = [];
      }
      separatedData[item.familyName].push(item);
    });
    return separatedData;
  };
  const separatedFormData = separateByFamilyName(formData);
  return (
   <div>
    {Loading?(<div style={{marginTop:"18%"}} >
      <center>
      <CircularProgress  color='inherit' />    
      </center>
    </div>):(
       <div className="container">
       <br />
       <center>
         <h1>{title}</h1>
       </center>
       {Object.entries(separatedFormData).map(([familyName, works]) => (
         <div key={familyName}>
           <h3>{familyName}</h3>
           <table className="table">
             <thead className="thead-dark">
               <tr>
                 <th>Date</th>
                 <th>Brick Count</th>
                 <th>Actual Bricks</th>
                 <th>Salary</th>
                 <th>Status</th>
                 <th>Paid Details</th>
               </tr>
             </thead>
             <tbody>
               {works.map((data) => (
                 <tr key={data.id}>
                   <td>{data.date}</td>
                   <td>{data.bricksCount}</td>
                   <td>{data.remainingBricks}</td>
                   <td>{data.salary}</td>
                   <td style={{ color: data.status === 'paid' ? 'green' : 'red' }}>
                     {data.status}
                   </td>
                   {data.status === 'paid' ? (
                     <td>{data.payDate}</td>
                   ) : (
                     <td>
                       {data.status === 'pending' && (
                         <button
                           className="btn btn-danger"
                           onClick={() => handleDelete(data.id)}>
                           Delete
                         </button>
                       )}
                     </td>
                   )}
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       ))}
     </div>
    )}
   </div>
  );
};
ShowWork.defaultProps={
  title:"Rvr Bricks"
}
export default ShowWork;
