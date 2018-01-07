import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import { ListItem }     from 'material-ui/List';
import IconButton       from 'material-ui/IconButton';
import Avatar           from 'material-ui/Avatar';
import DeviceWallpaper  from 'material-ui/svg-icons/device/wallpaper';
import ActionExit       from 'material-ui/svg-icons/action/exit-to-app';
import CircularProgress from 'material-ui/CircularProgress';

import InputWithDelay   from '../common/InputWithDelay';

class UserInfo extends Component {
  constructor(props) {
    super(props);

    this.state = { loading: false }

    this.handleLogout = this.handleLogout.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleLogout() {
    this.setState({ loading: true });
    axios.delete('/api/logout')
    .then(res => {
      this.props.history.push('/login');
      this.props.onLogout();
      if(this.props.notifiers)
        this.props.notifiers.success('Logged out');
    })
    .catch(err => {
      if(this.props.notifiers) this.props.notifiers.error(err);
      this.setState({ loading: false });
    });
  }

  handleUpdate(data) {
    this.setState({ loading: true });
    axios.put(`/api/current_user`, data)
    .then(res => {
      this.setState({ loading: false });
      this.props.onUpdate(res.data);
    })
    .catch(err => {
      this.setState({ loading: false });
      if(this.props.notifiers) this.props.notifiers.error(err);
    })
  }

  render() {
    const { name, email } = this.props.user;
    return (
      <ListItem
        disabled={true}
        leftAvatar={<Avatar icon={<DeviceWallpaper />} />}
        rightIcon={
          <IconButton
            onClick={this.handleLogout}
            style={{padding: 0 }}>
            { this.state.loading ?
              <CircularProgress size={20} thickness={2} /> :
              <ActionExit />
            }
          </IconButton>
        }
        primaryText={
          <InputWithDelay
            value={name}
            onChangeStop={name => this.handleUpdate({ name })}
          />
        }
        secondaryText={email}>
      </ListItem>
    )
  }
}

export default withRouter(UserInfo);
