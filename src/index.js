import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import App from './components/App';
import PrivateRoute from './components/common/PrivateRoute';
import UserLogin from './components/User/Login';
import UserRegister from './components/User/Register';

import registerServiceWorker from './registerServiceWorker';

const Main = () => (
  <MuiThemeProvider>
    <Router>
      <Switch>
        <Route exact path="/register" component={UserRegister} />
        <Route exact path="/login" component={UserLogin} />
        <PrivateRoute path="/" component={App} />
      </Switch>
    </Router>
  </MuiThemeProvider>
)

ReactDOM.render(<Main />, document.getElementById('root'));
registerServiceWorker();
