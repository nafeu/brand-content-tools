import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Navigation from './components/navigation/index.jsx';
import Home from './components/pages/home/index.jsx';
import About from './components/pages/about/index.jsx';
import ImageBuilder from './components/pages/image-builder/index.jsx';
import SocialInfo from './components/pages/social-info/index.jsx';

const App = () => {
  return (
    <Router>
      <div>
        <Navigation />
        <Switch>
          <Route path="/image-builder">
            <ImageBuilder />
          </Route>
          <Route path="/social-info">
            <SocialInfo />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
