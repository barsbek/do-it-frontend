import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';

import UserInfo from './user/UserInfo';
import Previews from './components/Collection/Previews';
import withLocalStorage from './components/withLocalStorage';

import Collection from './components/Collection';

import './App.css';

const PreviewsWithStorage = withLocalStorage(Previews);
const CollectionWithStorage = withLocalStorage(Collection);

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

  componentWillMount() {
    this.props.history.listen((location, action) => {
      this.openDrawer(false);
    }) 
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
        />
        <Drawer
          open={this.state.drawer} docked={false}
          onRequestChange={d => this.openDrawer(d)}
        >
          <UserInfo user={this.props.user} onLogout={this.props.onLogout} />
          <PreviewsWithStorage
            pathname="/api/collections"
            name="collections"
            itemsName="collections"
          />
        </Drawer>

        <div className="app-content">
          <Route path="/collections/:id" render={props => {
            const { id } = props.match.params;
            return (
              <CollectionWithStorage
                id={id}
                pathname={`/api/collections/${id}`}
                name={`collections-${id}`}
                itemsName="lists"
              />
            )
          }} />
        </div>
      </div>
    )
  }
}

export default withRouter(App);
