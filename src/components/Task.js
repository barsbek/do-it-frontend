import React, { Component } from 'react';
import axios from 'axios';

import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task: props.task
    }

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    if(!this.state.task.id) {
      this.createTask();
    }
  }

  createTask(title) {
    const list_id = this.props.list.id;
    axios.post(`/api/tasks`, { title, list_id })
    .then(res => {
      this.setState({ task: res.data });
      this.props.updateList(res.data);
    })
    // get from parent or move into component
    .catch(this.props.onFailure);
  }

  handleChange(e) {
    this.setState({ title: e.target.value });
  }

  handleClick(e) {
    console.log('asdf');
  }

  render() {
    return (
      <TextField
        hintText={"Change task"}
        value={this.state.task.title}

        onChange={this.handleChange}
        underlineShow={false}
      />
    )
  }
}

export default Task;
