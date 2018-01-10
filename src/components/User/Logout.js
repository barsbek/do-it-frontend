import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import url from 'url';

import IconButton       from 'material-ui/IconButton';
import ActionExit       from 'material-ui/svg-icons/action/exit-to-app';
import CircularProgress from 'material-ui/CircularProgress';

import Storage from '../../modules/Storage';

class UserLogout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: this.props.loading
    }
  }

  _clearStorage() {
    const collections = new Storage('collections').data;
    if(!collections) return true;
    collections.forEach(c => {
      const storageName = `collection-${c.id}`;
      const lists = new Storage(storageName).data;
      if(lists) { 
        lists.forEach(list => Storage.delete(`list-${list.id}`));
      }
      Storage.delete(storageName);
    });
    Storage.delete('collections');
  }

  handleLogout = () => {
    this.setState({ loading: true });
    axios.delete('/api/logout')
    .then(res => {
      this.props.history.push('/login');
      this.props.onLogout();
      this._clearStorage();
    })
    .catch(err => {
      if(this.props.notifiers) this.props.notifiers.error(err);
      this.setState({ loading: false });
    });
  }

  render() {
    return (
      <IconButton
        onClick={this.handleLogout}
        style={{ paddingLeft: 6 }}>
        { this.state.loading ?
          <CircularProgress size={20} thickness={2} /> :
          <ActionExit />
        }
      </IconButton>
    )
  }
}

export default withRouter(UserLogout);
