import React, { Component } from 'react';

import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';

import InputWithDelay from './InputWithDelay';

class List extends Component {
  render() {
    return (
      <Paper zDepth={1} className="collection-list">
        <Subheader style={{ paddingLeft: 0 }}>         
          <DelayChangeInput
            value={this.props.title}
            name="title"
            onChange={this.props.onTitleChange}
            onFocus={this.props.onTitleFocus} 
            underlineStyle={{ borderColor: 'transparent'}}
            fullWidth={true}
          />
        </Subheader>

        <TextField
          fullWidth={true}
          inputStyle={{ paddingLeft: 10 }}
          hintStyle={{ textAlign: 'center', width: '100%' }}
          underlineStyle={{ bottom: 0 }}
          className="collection-new-task"
          hintText="+" />
      </Paper>
    )
  }
}

export default List;
