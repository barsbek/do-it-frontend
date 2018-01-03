import React, { Component } from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class AlertDialog extends Component {
  renderActions() {
    return [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.props.onClose}
      />,
      <FlatButton
        label="Delete"
        primary={true}
        onClick={this.props.onApprove}
      />
    ];
  }

  render() {
    return (
      <Dialog
        actions={this.renderActions()} 
        open={this.props.open}
        onRequestClose={this.props.onClose}
      >
        {this.props.title}
      </Dialog>
    );
  }
}

export default AlertDialog;
