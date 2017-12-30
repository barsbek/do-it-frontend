import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import { ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import DeviceWallpaper from 'material-ui/svg-icons/device/wallpaper';
import ActionExit from 'material-ui/svg-icons/action/exit-to-app';

class UserInfo extends Component {
  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    axios.delete('/api/logout')
    .then(res => {
      this.props.history.push('/login');
      this.props.onLogout();
    })
    .catch(err => alert(err));
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
            <ActionExit />
          </IconButton>
        }
        primaryText={name}
        secondaryText={email}>
      </ListItem>
    )
  }
}

export default withRouter(UserInfo);
