import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './index.css';
import App from './App';
import PrivateRoute from './common/PrivateRoute';
import Login from './user/LoginForm';
import Register from './user/Register';

import registerServiceWorker from './registerServiceWorker';

const Main = () => (
  <MuiThemeProvider>
    <Router>
      <Switch>
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <PrivateRoute path="/" component={App} />
      </Switch>
    </Router>
  </MuiThemeProvider>
)

ReactDOM.render(<Main />, document.getElementById('root'));
registerServiceWorker();
