import React, { Component } from 'react';
import update from 'immutability-helper';
import axios from 'axios';

import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import CircularProgress from 'material-ui/CircularProgress';

import InputWithDelay from '../InputWithDelay';
// import Task from './Task';

class CollectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      temps: [],
      loading: true,
    };
  }

  renderTasks() {
    this.state.tasks.map((t, index) => {
      <div key={t.id || "new"}>t.title</div>
      // <Task
      //   key={t.id || "new"}
      //   list={this.props.list}
      //   task={t}
      // />
    })
  }

  render() {
    const { title } = this.props.item;
    return (
      <Paper zDepth={1} className="list">
        <Subheader style={{ paddingLeft: 0 }}>         
          <InputWithDelay
            value={title}
            name="title"
            onChangeStop={title => this.props.change({ title })}
            fullWidth={true}
          />
        </Subheader>
        <div className="list-tasks">
          {/* {this.state.loading ? 
            <CircularProgress size={24}/> : 
            this.renderTasks()
          } */}
        </div>
        <TextField
          hintText="+"
          onKeyPress={this.addTask}

          // move styles into separate file
          fullWidth={true}
          inputStyle={{ paddingLeft: 10 }}
          hintStyle={{ textAlign: 'center', width: '100%' }}
          underlineStyle={{ bottom: 0 }}
        />
      </Paper>
    )
  }
}

export default CollectionList;
