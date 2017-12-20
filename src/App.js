import React, { Component } from 'react';
import Snackbar from 'material-ui/Snackbar'

import Register from './user/Register';

import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      notice: '',
      snackBar: false
    };

    this.onNoticeChange = this.onNoticeChange.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  onNoticeChange(notice) {
    this.setState({
      notice: notice,
      snackBar: true
    })
  }

  handleRequestClose() {
    this.setState({
      snackBar: false
    })
  }

  render() {
    return [
      <Register key="register"
        changeNotice={this.onNoticeChange}/>,
      <Snackbar key="snack"
        open={this.state.snackBar}
        message={this.state.notice}
        autoHideDuration={2000}
        onRequestClose={this.handleRequestClose} />
    ];
  }
}

export default App;
