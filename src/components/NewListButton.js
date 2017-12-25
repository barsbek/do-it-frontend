import React, { Component } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import axios from 'axios';

const style = {
  position: 'fixed',
  bottom: 16,
  right: 16
}

class NewListButton extends Component {
  render() {
    return (   
      <FloatingActionButton onClick={this.props.onClick}
        mini={true} style={style}>
        <ContentAdd />
      </FloatingActionButton>
    )
  }
}

export default NewListButton;
