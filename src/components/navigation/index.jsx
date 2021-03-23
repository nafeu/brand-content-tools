import React from 'react';
import { Link } from 'react-router-dom'

const Navigation = () => (
  <div className="navigation">
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/image-builder">Image Builder</Link>
      </li>
      <li>
        <Link to="/social-info">Social Info</Link>
      </li>
      <li>
        <Link to="/about">About</Link>
      </li>
    </ul>
  </div>
);

export default Navigation;
