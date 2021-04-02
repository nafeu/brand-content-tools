import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

const Navigation = () => (
  <Navbar className="rounded" bg="dark" variant="dark">
    <Navbar.Brand as={Link} to="/">
      brand-content-tools
    </Navbar.Brand>
    <Nav className="mr-auto">
      <Nav.Link as={Link} to="/idea-generator">
        Idea Generator
      </Nav.Link>
      <Nav.Link as={Link} to="/image-builder">
        Image Builder
      </Nav.Link>
      <Nav.Link as={Link} to="/social-info">
        Social Info
      </Nav.Link>
      <Nav.Link as={Link} to="/about">
        About
      </Nav.Link>
    </Nav>
  </Navbar>
);

export default Navigation;
