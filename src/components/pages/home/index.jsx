import React from 'react';
import { Link } from 'react-router-dom';
import { Jumbotron, Button, Row, Col } from 'react-bootstrap';

const Home = () => (
  <Row>
    <Col xs={12} sm={12} md={{ span: 10, offset: 1 }} lg={{ span: 8, offset: 2 }}>
      <Jumbotron>
        <h1>Hey there content creator!</h1>
        <p>
          "Brand content tools" is set of tools to help a youtube, twitch or instagram content creator automate the monotonous.
        </p>
        <p>
          <Button as={Link} to={"/idea-generator"} variant="primary">Get Started</Button>
        </p>
      </Jumbotron>
    </Col>
  </Row>
);

export default Home;
