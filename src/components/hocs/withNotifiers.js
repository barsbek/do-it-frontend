import React, { Component } from 'react';
import Snackbar from 'material-ui/Snackbar';

export default function withNotifiers(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        open: false,
        message: '',
      }

      this.hideSnackbar = this.hideSnackbar.bind(this);
    }

    notifyError(err) {
      if(err.response && (typeof err.response.data === 'object')) {
        if(err.response.data.message) 
          return this.handleNoticeChange(err.response.data.message);
      }
      this.handleNoticeChange("Something went wrong, try again later");
    }
  
    notifySuccess(res) {
      if(typeof res.data === 'object' && res.data.message) {
        this.handleNoticeChange(res.data.message);
      }
    }
  
    handleNoticeChange(message) {
      this.setState({ message, open: true });
    }
  
    getNotifiers() {
      return {
        error: this.notifyError.bind(this),
        success: this.notifyError.bind(this)
      }
    }

    hideSnackbar() {
      this.setState({ open: false })
    }

    render() {
      return [
        <WrappedComponent
          {...this.props}
          notifiers={this.getNotifiers()}
        />,
        <Snackbar
          open={this.state.open}
          message={this.state.message}
          autoHideDuration={1000}
          onRequestClose={this.hideSnackbar}
        />
      ]
    }
  }
}
