import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';

class Logout extends Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    const url = e.target.href;
    axios.get("/api/logout")
    .then(res => {
      this.props.onLogout(res);
      if(res.headers.location)
        this.props.history.push(res.headers.location);
    })
    .catch(err => {
      this.props.changeNotice('Something went wrong');
    })
  }
  render() {
    return <FlatButton onClick={this.handleClick} label="Log out"
      style={{color: '#fff', marginTop: '6px'}} />
  }
}

export default withRouter(Logout);
