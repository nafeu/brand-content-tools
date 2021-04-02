import React from 'react';
import { Row, Col } from 'react-bootstrap';

const About = () => (
  <Row>
    <Col xs={12} sm={12} md={{ span: 10, offset: 1 }} lg={{ span: 8, offset: 2 }}>
      <h1 className="p-5 text-muted">
        I just want to make content, I don't want to think about anything else.
      </h1>
    </Col>
  </Row>
);

export default About;
