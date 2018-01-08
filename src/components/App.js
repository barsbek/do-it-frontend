import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import MediaQuery from 'react-responsive';

import Drawer   from 'material-ui/Drawer';
import IconButton   from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';

import UserInfo           from './User/Info';
import Collection         from './Collection';
import CollectionPreviews from './Collection/Previews';
import withNotifiers      from './hocs/withNotifiers';

import styles from './App.css';

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
      <div className={styles.App}>
        <IconButton
          className={styles.MenuIcon}
          onClick={() => this.openDrawer(true)}>
          <NavigationMenu />
        </IconButton>
        <MediaQuery maxWidth={800}>
          { matches => <Drawer 
            docked={!matches}
            disableSwipeToOpen={true}
            open={!matches || this.state.drawer}
            onRequestChange={this.openDrawer}
            width={280} >
            <UserInfo user={this.props.user}
              onLogout={this.props.onLogout}
              onUpdate={this.props.onUserUpdate}
            />
            <CollectionPreviews notifiers={this.props.notifiers} />
          </Drawer> }
        </MediaQuery>
        <Route path="/collections/:id" render={props => (
          <Collection
            {...props}
            withID={props.match.params.id}
            notifiers={this.props.notifiers}
          />
        )} />
      </div>
    )
  }
}

export default withNotifiers(App);
