import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
  const location = useLocation();

  return (
    <Navbar bg="dark" variant="dark" expand="md" fixed="top">
      <Navbar.Brand as={Link} to="/" style={{marginLeft:"20px"}}>RVR Bricks</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/" active={location.pathname === '/'} style={{marginLeft:"80px"}}>
            Add Work
          </Nav.Link>
          <Nav.Link as={Link} to="/ShowWork" active={location.pathname === '/ShowWork'} style={{marginLeft:"80px"}}>
            Show Work
          </Nav.Link>
          <Nav.Link as={Link} to="/AddWorker" active={location.pathname === '/AddWorker'}style={{marginLeft:"80px"}}>
            Add Worker
          </Nav.Link>
          <Nav.Link as={Link} to="/workcalculate" active={location.pathname === '/workcalculate'}style={{marginLeft:"80px"}}>
           Calculate Work and Pay
          </Nav.Link>
          <Nav.Link as={Link} to="/payoutspage" active={location.pathname === '/payoutspage'}style={{marginLeft:"80px"}}>
           Payment History
          </Nav.Link>
          <Nav.Link as={Link} to="/settings" active={location.pathname === '/settings'}style={{marginLeft:"80px"}}>
            Settings
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
