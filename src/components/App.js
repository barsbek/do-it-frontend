import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import AppBar   from 'material-ui/AppBar';
import Drawer   from 'material-ui/Drawer';

import UserInfo           from './User/Info';
import Collection         from './Collection';
import CollectionPreviews from './Collection/Previews';
import withNotifiers      from './hocs/withNotifiers';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      drawer: false,
      collections: []
    };

    this.openDrawer = this.openDrawer.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.location !== this.props.location) {
      this.openDrawer(false);
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
        />
        <Drawer
          open={this.state.drawer} docked={false}
          onRequestChange={d => this.openDrawer(d)}
        >
          <UserInfo user={this.props.user}
            onLogout={this.props.onLogout}
            onUpdate={this.props.onUserUpdate}
          />
          <CollectionPreviews notifiers={this.props.notifiers} />
        </Drawer>

        <div className="app-content">
          <Route path="/collections/:id" render={props => (
            <Collection
              {...props}
              withID={props.match.params.id}
              notifiers={this.props.notifiers}
            />
          )} />
        </div>
      </div>
    )
  }
}

export default withNotifiers(App);
