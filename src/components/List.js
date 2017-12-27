import React, { Component } from 'react';
import update from 'immutability-helper';
import axios from 'axios';

import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

import InputWithDelay from './InputWithDelay';
import Task from './Task';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: this.props.list,
      tasks: []
    };

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.addTask = this.addTask.bind(this);
  }

  handleTitleChange(title) {
    if(this.state.list.id) {
      this.updateList(title);
    } else {
      this.createList(title);
      // remove or save to local storage on creation failure
    }
  }

  createList(title) {
    const collection_id = this.props.collection.id;
    axios.post(`/api/lists`, { title, collection_id })
    .then(res => {
      this.setState({ list: res.data });
      this.props.updateCollection(res.data);
    })
    .catch(this.props.onFailure);
  }

  updateList(title) {
    const listID = this.state.list.id;
    axios.put(`/api/lists/${listID}`, { title })
    .then(res => {
      this.setState({ list: res.data });
    })
    .catch(this.props.onFailure);
  }

  addTask(e) {
    if(e.key === 'Enter') {
      this.setState(update(this.state, {
        tasks: {$push: [{title: e.target.value}]}
      }));
      e.target.value = '';
    }
  }

  handleonTaskSaved(task) {
    const index = this.state.tasks.length - 1;
    this.setState(update(this.state, {
      tasks: {
        [index]: {$set: task}
      }
    }))
  }

  render() {
    const tasks = this.state.tasks.map(t => (
      <Task
        key={t.id}
        list={this.state.list}
        task={t}
        onTaskSaved={this.handleonTaskSaved}
      />
    ));

    return (
      <Paper zDepth={1} className="list">
        <Subheader style={{ paddingLeft: 0 }}>         
          <InputWithDelay
            value={this.state.list.title}
            name="title"
            onChangeStop={this.handleTitleChange}
            fullWidth={true}
          />
        </Subheader>
        <div className="list-tasks">
          {tasks}
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

export default List;
