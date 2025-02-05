import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { NavLink } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

function Mysidebar() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
  <div style={{position:"fixed" ,marginLeft:"0px",marginTop:"40px"}}>
      <   >
      <Button className='btn btn-light' onClick={handleShow}>
        <FaBars />
      </Button>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className='text-lg' style={{ color: 'blue' }}>
<center>
  RVR Bricks  Work management
</center>
  </Offcanvas.Title>
        </Offcanvas.Header>
        <hr />
        <Offcanvas.Body>
          <ul className="list-group list-group-flush">
            <NavLink exact to="/" className="list-group-item list-group-item-action" style={{marginBottom:"30px"}} activeClassName="active dark" onClick={handleClose}>
              Add work
            </NavLink>
            <br /><br />
            <NavLink to="/ShowWork" className="list-group-item list-group-item-action" style={{marginBottom:"30px"}} activeClassName="active" onClick={handleClose}>
              Show Work
            </NavLink>
            <br /><br />
            <NavLink to="/AddWorker" className="list-group-item list-group-item-action" style={{marginBottom:"30px"}} activeClassName="active" onClick={handleClose}>
              Add Worker
            </NavLink>
            <br/><br />
            <NavLink to="/workcalculate" className="list-group-item list-group-item-action" style={{marginBottom:"30px"}} activeClassName="active" onClick={handleClose}>
             Calculate work and pay
            </NavLink>
            <br /><br />
            <NavLink to="/payoutspage" className="list-group-item list-group-item-action" style={{marginBottom:"30px"}} activeClassName="active" onClick={handleClose}>
             Payment history
            </NavLink>
            <br /><br />
            
            <NavLink to="/settings" className="list-group-item list-group-item-action"  activeClassName="active" onClick={handleClose}>
             Settings
            </NavLink>
            <hr />
          </ul>
          
        </Offcanvas.Body>
        <div style={{backgroundColor:"#000", color:"#fff", fontStyle:"italic", padding:"10px"}}>
<center>          <p>Made with <a href='https://workfys.in/' target='_blank' className='text-primary' style={{textDecoration:"none"}}>Workfys</a></p>
</center>
        </div>
      </Offcanvas>
    </>
  </div>
  );
}

export default Mysidebar;

