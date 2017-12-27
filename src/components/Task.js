import React, { Component } from 'react';
import axios from 'axios';

import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

import InputWithDelay from './InputWithDelay';

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task: props.task
    }

    this.handleTitleUpdate = this.handleTitleUpdate.bind(this);
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

  render() {
    
    return (
      <InputWithDelay
        hintText={"Change task"}
        value={this.state.task.title}

        onChangeStop={this.handleTitleUpdate}
        underlineShow={false}
      />
    )
  }
}

export default Task;
