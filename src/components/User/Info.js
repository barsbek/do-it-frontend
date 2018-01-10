import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import Avatar           from 'material-ui/Avatar';
import DeviceWallpaper  from 'material-ui/svg-icons/device/wallpaper';

import InputWithDelay   from '../common/InputWithDelay';
import UserLogout           from './Logout';

import styles from './Info.css';

class UserInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      avatar: this.props.user.avatar_thumb,
    }

    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleAvatarClick = this.handleAvatarClick.bind(this);
    this.changeAvatar = this.changeAvatar.bind(this);
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
        <UserLogout
          onLogout={this.props.onLogout}
          loading={this.state.loading}
        />
      </div>
    )
  }
}

export default withRouter(UserInfo);
