import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';

import UserInfo from './user/UserInfo';
import Logout from './user/Logout';
import Collections from './components/Collections';
import Collection from './components/Collection';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      drawer: false,
      collections: []
    };

    this.notifyAboutSuccess = this.notifyAboutSuccess.bind(this);
    this.notifyAboutError = this.notifyAboutError.bind(this);

    this.openDrawer = this.openDrawer.bind(this);
  }

  notifyAboutError(err) {
    if(err.response && (typeof err.response.data === 'object')) {
      if(err.response.data.message) 
        return this.handleNoticeChange(err.response.data.message);
    }
    this.handleNoticeChange("Something went wrong");
  }

  notifyAboutSuccess(res) {
    if(typeof res.data === 'object') {
      this.handleNoticeChange(res.data.message);
    }
  }

  openDrawer(drawer) {
    this.setState({ drawer });
  }

  render() {
    return (
      <div className="app">
        <AppBar
          title="title"
          onLeftIconButtonClick={() => this.openDrawer(true)}
          iconElementRight={<Logout />}
        />
        <Drawer
          open={this.state.drawer} docked={false}
          onRequestChange={d => this.openDrawer(d)}
        >
          <UserInfo user={this.props.user} />
          <Collections />
        </Drawer>

        <div className="app-content">
          <Route path="/collections/:id" component={Collection} />
        </div>
      </div>
    )
  }
}

export default App;
