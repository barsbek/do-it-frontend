import React, { Component } from 'react';
import Snackbar from 'material-ui/Snackbar';
import { BrowserRouter as Router, Route, Redirect, Switch, withRouter } from 'react-router-dom';
import axios from 'axios';

import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import CircularProgress from 'material-ui/CircularProgress';

import Register from './user/Register';
import LoginForm from './user/LoginForm';
import UserInfo from './user/UserInfo';
import NoMatch from './NoMatch';
import Private from './Private';

import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      notice: '',
      snackBarOpen: false,
      drawerOpen: false,
      user: null,
      isAuthenticated: false
    };
    this.handleNoticeChange = this.handleNoticeChange.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  componentWillMount() {
    axios.get('users')
    .then(res => {
      this.setState({ user: res.data.user, isAuthenticated: !!res.data.user });
    })
    .catch(err => {
      if(err.response && (typeof err.response.data === 'object')) {
        const data = err.response.data;
        if(data.message) this.handleNoticeChange(data.message);
      } else {
        this.handleNoticeChange("Something went wrong");
      }
    })
  }

  handleNoticeChange(notice) {
    this.setState({ notice: notice, snackBarOpen: true })
  }

  handleRequestClose() {
    this.setState({ snackBarOpen: false })
  }

  handleDrawerToggle() {
    this.setState({ drawerOpen: !this.state.drawerOpen })
  }

  handleLogin(res) {
    this.setState({ user: res.data.user, isAuthenticated: true })
  }

  render() {
    return (
      <Router>
        <div className="app">
          <Private isAuthenticated={this.state.isAuthenticated}>
            <AppBar title="title"
              onLeftIconButtonClick={this.handleDrawerToggle} />
            <Drawer open={this.state.drawerOpen}>
              <UserInfo user={this.state.user} />
            </Drawer>
          </Private>
          <Switch>
            <Route exact path="/login"
              render={() => <LoginForm onSuccess={this.handleLogin} changeNotice={this.handleNoticeChange}/>}/>
            <Route exact path="/register"
              render={() => <Register changeNotice={this.handleNoticeChange}/>}/>
            <Route component={NoMatch} />
          </Switch>
          <Snackbar key="snack"
            open={this.state.snackBarOpen}
            message={this.state.notice}
            autoHideDuration={2000}
            onRequestClose={this.handleRequestClose} />
        </div>
      </Router>
    )
  }
}

export default App;
