import React, { Component } from 'react';
import axios from 'axios';
import { SortableHandle } from 'react-sortable-hoc';

import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import NavigationCancel from 'material-ui/svg-icons/navigation/cancel';

import InputWithDelay from './InputWithDelay';

import './Task.css';

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completed: props.task.completed
    }

    this.handleTitleUpdate = this.handleTitleUpdate.bind(this);
    this.toggleComplete = this.toggleComplete.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleTitleUpdate(title) {
    // TODO: animate saving process
    const taskID = this.props.task.id;
    axios.put(`/api/tasks/${taskID}`, { title })
    .then(res => {
      this.setState({ task: res.data });
    })
    .catch(this.props.onFailure);
  }

  toggleComplete() {
    const taskID = this.props.task.id;
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

  handleDelete() {
    const task = this.props.task;
    this.props.detachTask(task);

    axios.delete(`/api/tasks/${this.props.task.id}`)
    .then(res => {
      this.props.onTaskDeleted(task);
    })
    .catch(err => {
      this.props.attachTask(task);
      if(this.props.onFailure) this.props.onFailure(err);
    });
  }

  render() {
    const TaskSorter = SortableHandle(() => <span>:::</span>);
    return (
      <div>
        <TaskSorter />
        <Checkbox
          checked={this.state.completed}
          onCheck={this.toggleComplete}
          label={
            <InputWithDelay
              hintText={"Change task"}
              value={this.props.task.title}
              onChangeStop={this.handleTitleUpdate}
              underlineShow={false}
              style={{ zIndex: 2 }}
            />
          }
        />
        <IconButton
          className="task-delete-button"
          onClick={this.handleDelete}
        >
          <NavigationCancel />
        </IconButton>
      </div>
    )
  }
}

export default Task;
