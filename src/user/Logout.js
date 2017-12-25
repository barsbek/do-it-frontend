import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import url from 'url';

class Logout extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    axios.delete("/api/logout")
    .then(res => {
      this.props.onLogout(res);
      if(res.headers) this.handleRedirect(res.headers.location);
    })
    .catch(err => {
      if(this.props.onFailure) this.props.onFailure(err);
    })
  }

  handleRedirect(toURL) {
    const redirectTo = url.parse(toURL || '');
    this.props.history.push(redirectTo.pathname);
  }

  render() {
    return <FlatButton onClick={this.handleClick} label="Log out"
      style={{color: '#fff', marginTop: '6px'}} />
  }
}

export default withRouter(Logout);
