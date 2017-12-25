import React, { Component } from 'react';

import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';

import TitleTextField from './TitleTextField';

class List extends Component {
  render() {
    return (
      <Paper zDepth={1} className="collection-list">
        <Subheader style={{ paddingLeft: 0 }}>         
          <TitleTextField
            value={this.props.title}
            onChangeFinish={this.props.onChangeFinish}
            onFocus={this.props.onTitleFocus} 
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
