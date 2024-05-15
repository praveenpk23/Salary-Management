import React from 'react';
import INlofo from '../no-disconnect.png'
const NoInternet = () => {
  return (
  <center>
      <div className="container " style={{marginTop:"10%"}}>
      <div className="row">
        <div className="col-md-12 text-center">
          <img
            src={INlofo} // Replace with the URL of your image
            alt="No Internet Connection"
            className="img-fluid mb-3"
            style={{ maxWidth: '600px' }} // Adjust the size of the image as needed
          />
          <h1>No Internet Connection</h1>
          <p>Please check your internet connection and try again.</p>
        </div>
      </div>
    </div>
  </center>
  );
};

export default NoInternet;
