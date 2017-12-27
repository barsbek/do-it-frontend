import React, { Component } from 'react';
import axios from 'axios';

import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

import InputWithDelay from './InputWithDelay';

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task: props.task,
      completed: props.task.completed
    }

    this.handleTitleUpdate = this.handleTitleUpdate.bind(this);
    this.toggleComplete = this.toggleComplete.bind(this);
  }

  componentWillMount() {
    if(!this.state.task.id) {
      this.createTask(this.state.task.title);
    }
  }

  createTask(title) {
    const list_id = this.props.list.id;
    axios.post(`/api/tasks`, { title, list_id })
    .then(res => {
      this.setState({ task: res.data });
      if(this.props.onTaskSaved) this.props.onTaskSaved(res.data);
    })
    // TODO: get failure method
    .catch(this.props.onFailure);
  }

  handleTitleUpdate(title) {
    // TODO: animate saving process
    const taskID = this.state.task.id;
    axios.put(`/api/tasks/${taskID}`, { title })
    .then(res => {
      this.setState({ task: res.data });
    })
    .catch(this.props.onFailure);
  }

  toggleComplete() {
    const taskID = this.state.task.id;
    const completed = !this.state.completed;
    this.setState({ completed });
    axios.put(`/api/tasks/${taskID}`, { completed })
    .then(res => {
      this.props.onTaskSaved(res.data);
    })
    .catch(err => {
      if(this.props.onFailure) this.props.onFailure(err);
      this.setState({ completed: !completed });
    });
  }

  render() {
    return (
      <div>
        <Checkbox
          checked={this.state.completed}
          onCheck={this.toggleComplete}
          label={
            <InputWithDelay
              hintText={"Change task"}
              value={this.state.task.title}
              onChangeStop={this.handleTitleUpdate}
              underlineShow={false}
              style={{ zIndex: 2 }}
            />
          }
        />
      </div>
    )
  }
}

export default Task;
