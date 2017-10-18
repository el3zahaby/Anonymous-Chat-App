import React, { Component } from 'react';
import {Router,Route,browserHistory } from 'react-router';

/* Containers */
import Home from './containers/Home'
import Chat from './containers/Chat'

class App extends Component {
  render() {
    return (
        <Router history={browserHistory}>
          <Route path="/" components={Home} />
          <Route path="/chat" components={Chat} />
        </Router>
    );
  }
}

export default App;
