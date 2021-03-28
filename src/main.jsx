import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Navigation from './components/navigation/index.jsx';
import Home from './components/pages/home/index.jsx';
import About from './components/pages/about/index.jsx';
import ImageBuilder from './components/pages/image-builder/index.jsx';
import SocialInfo from './components/pages/social-info/index.jsx';

import { Container, Row, Col } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';

const App = () => {
  return (
    <Router>
      <div>
        <Container className="mt-5" fluid>
          <Row>
            <Col xs={12} sm={12} md={{ span: 10, offset: 1 }} lg={{ span: 8, offset: 2 }}>
              <Navigation />
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <Switch>
                <Route path="/social-info">
                  <SocialInfo />
                </Route>
                <Route path="/image-builder">
                  <ImageBuilder />
                </Route>
                <Route path="/about">
                  <About />
                </Route>
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            </Col>
          </Row>
        </Container>
      </div>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
