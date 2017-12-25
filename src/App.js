import React, { Component } from 'react';
import Snackbar from 'material-ui/Snackbar';
import { BrowserRouter as Router, Route, Redirect, Switch, withRouter } from 'react-router-dom';
import axios from 'axios';

import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

import Register from './user/Register';
import LoginForm from './user/LoginForm';
import UserInfo from './user/UserInfo';
import Logout from './user/Logout';

import Private from './common/Private';
import PrivateRoute from './common/PrivateRoute';
import LoadingAnimation from './common/LoadingAnimation';

import Collections from './components/Collections';
import Collection from './components/Collection';
import List from './components/List';

import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      notice: '',
      
      snackBarOpen: false,
      drawerOpen: false,
      isAuthenticated: false,
      // loading information in every component
      loading: true,
      
      user: null,
      collections: []
    };

    this.handleNoticeChange = this.handleNoticeChange.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);

    this.closeLoading = this.closeLoading.bind(this);
    this.notifyAboutSuccess = this.notifyAboutSuccess.bind(this);
    this.notifyAboutError = this.notifyAboutError.bind(this);
  }

  componentDidMount() {
    axios.get('/api/current_user')
    .then(res => {
      // get from localStorage
      // you should, probably, move token to localStorage
      this.setState({
        user: res.data.user,
        isAuthenticated: !!res.data.user
      })
    })
    .catch(err => this.notifyAboutError(err))
    .then(() => this.closeLoading())
  }

  notifyAboutError(err) {
    if(err.response && (typeof err.response.data === 'object')) {
      this.handleNoticeChange(err.response.data.message);
    } else {
      this.handleNoticeChange("Something went wrong");
    }
  }

  notifyAboutSuccess(res) {
    if(typeof res.data === 'object') {
      this.handleNoticeChange(res.data.message);
    }
  }

  handleNoticeChange(notice) {
    this.setState({ notice: notice, snackBarOpen: true })
  }

  handleRequestClose() {
    this.setState({ snackBarOpen: false })
  }

  handleDrawerOpen() {
    this.setState({ drawerOpen: true })
  }

  handleLogin(res) {
    this.setState({ user: res.data.user, isAuthenticated: true })
    this.handleNoticeChange(res.data.message);
  }

  handleLogout(res) {
    this.setState({ user: null, isAuthenticated: false });
    this.handleNoticeChange(res.data.message);
  }

  closeLoading() {
    this.setState({ loading: false });
  }

  render() {
    return (
      <Router>
        <div className="app">
          <LoadingAnimation loading={this.state.loading} />
          <Private isAuthenticated={this.state.isAuthenticated}
            loading={this.state.loading}>
            <AppBar title="title"
              onLeftIconButtonClick={this.handleDrawerOpen}
              iconElementRight={
                <Logout
                  onLogout={this.handleLogout}
                  onFailure={this.notifyAboutError}
                />
              }
            />
            <Drawer 
              open={this.state.drawerOpen} 
              docked={false}>
              <UserInfo user={this.state.user} />
              <Collections onFailure={this.notifyAboutError} />
            </Drawer>
          </Private>
          <div className="app-content">
            <Switch>
              <Route exact path="/login" render={() =>
                <LoginForm
                  onSuccess={this.handleLogin}
                  onFailure={this.notifyAboutError}
                />
              }/>
              <Route exact path="/register" render={() =>
                <Register
                  onSuccess={this.notifyAboutSuccess}
                  onFailure={this.notifyAboutError}
                />
              }/>
              <PrivateRoute
                path="/collections/:id"
                loading={this.state.loading}
                isAuthenticated={this.state.isAuthenticated} >
                <Collection onFailure={this.notifyAboutError} />
              </PrivateRoute>
            </Switch>
          </div>
          <Snackbar
            key="snack"
            open={this.state.snackBarOpen}
            message={this.state.notice}
            autoHideDuration={2000}
            onRequestClose={this.handleRequestClose}
          />
        </div>
      </Router>
    )
  }
}

export default App;
