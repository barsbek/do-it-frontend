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

import styles from './Info.css';

class UserInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      avatar: this.props.user.avatar_thumb,
    }

    this.handleLogout = this.handleLogout.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleAvatarClick = this.handleAvatarClick.bind(this);
    this.changeAvatar = this.changeAvatar.bind(this);
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

  changeAvatar(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.setState({ avatar: reader.result });
    });
    if(file) {
      reader.readAsDataURL(file);
      let data = new FormData();
      data.append('user[avatar]', file);
      this.handleUpdate(data);
    }
  }

  handleAvatarClick(e) {
    this.refs.avatar.click();
  }

  render() {
    const { name, email } = this.props.user;
    return (
      <div className={styles.Container}>
        <Avatar
          className={styles.Avatar}
          icon={<DeviceWallpaper />}
          src={this.state.avatar}
          onClick={this.handleAvatarClick}
        />
        <input hidden={true} ref='avatar' type='file' accept='image/*'
          onChange={this.changeAvatar}
        />
        <div className={styles.Idents}>
          <InputWithDelay
            name='name'
            value={name}
            className={styles.Title}
            onChangeStop={name => this.handleUpdate({ name })}
          />
          <div className={styles.Email}>
            {email}
          </div>
        </div>
        <IconButton
          onClick={this.handleLogout}
          className={styles.Logout}>
          { this.state.loading ?
            <CircularProgress size={20} thickness={2} /> :
            <ActionExit />
          }
        </IconButton>

      </div>
    )
  }
}

export default withRouter(UserInfo);
