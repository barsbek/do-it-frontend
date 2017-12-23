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
import NoMatch from './NoMatch';
import Private from './Private';
import LoadingAnimation from './common/LoadingAnimation';

import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      notice: '',
      snackBarOpen: false,
      drawerOpen: false,
      user: null,
      isAuthenticated: false,
      loading: true
    };

    this.handleNoticeChange = this.handleNoticeChange.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentWillMount() {
    axios.get('/api/users')
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
    .then(() => {
      this.setState({ loading: false });
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

  handleLogout(res) {
    this.handleNoticeChange(res.data.message);
    this.setState({ user: null, isAuthenticated: false });
  }

  render() {
    return (
      <Router>
        <div className="app">
          <LoadingAnimation loading={this.state.loading} />
          <Private isAuthenticated={this.state.isAuthenticated}
            loading={this.state.loading}>
            <AppBar title="title"
              onLeftIconButtonClick={this.handleDrawerToggle}
              iconElementRight={
                <Logout onLogout={this.handleLogout}
                  changeNotice={this.handleNoticeChange} />
              }
            />
            <Drawer open={this.state.drawerOpen}>
              <UserInfo user={this.state.user} />
            </Drawer>
          </Private>
          <Switch>
            <div className="app-content">
              <Route exact path="/login"
                render={() => <LoginForm onSuccess={this.handleLogin} changeNotice={this.handleNoticeChange}/>}/>
              <Route exact path="/register"
                render={() => <Register changeNotice={this.handleNoticeChange}/>}/>
              {/* <Route component={NoMatch} /> */}
            </div>
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
