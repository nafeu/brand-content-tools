import React from 'react';
import { Link } from 'react-router-dom';
import { Jumbotron, Button } from 'react-bootstrap';

const Home = () => (
  <div className="page-home">
    <Jumbotron>
      <h1>Hey there content creator!</h1>
      <p>
        "Brand content tools" is set of tools to help a youtube, twitch or instagram content creator automate the monotonous.
      </p>
      <p>
        <Button as={Link} to={"/image-builder"} variant="primary">Get Started</Button>
      </p>
    </Jumbotron>
  </div>
);

export default Home;
