import React, { Component } from 'react';
import update from 'immutability-helper';
import axios from 'axios';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove
} from 'react-sortable-hoc';

import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import CircularProgress from 'material-ui/CircularProgress';

import InputWithDelay from './InputWithDelay';
import Task from './Task';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: this.props.list,
      tasks: [],
      temps: [],
      loading: true,
    };

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.addTask = this.addTask.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
    this.attachTask = this.attachTask.bind(this);
    this.detachTask = this.detachTask.bind(this);
    this.handleTaskDeletion = this.handleTaskDeletion.bind(this);
  }

  componentWillMount() {
    if(!this.state.list.id) return null;
    axios.get(`/api/lists/${this.state.list.id}/tasks`)
    .then(res => {
      this.setState({
        tasks: res.data,
        loading: false
      })
    })
    .catch(this.props.onFailure)
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
    if(e.key !== 'Enter' || !e.target.value) return null;
    const title = e.target.value;
    this.setState(update(this.state, {
      tasks: {$push: [{ title }]}
    }));
    this.createTask(title);
    e.target.value = '';
  }

  createTask(title) {
    const list_id = this.state.list.id;
    axios.post(`/api/tasks`, { title, list_id })
    .then(res => {
      this.setState({ task: res.data });
      this.handleTaskSaved(res.data);
    })
    // TODO: get failure method
    .catch(this.props.onFailure);
  }

  handleTaskSaved(task) {
    let index = this.state.tasks.findIndex(t => t.id === task.id);
    if(index === -1) return null;
    this.setState(update(this.state, {
      tasks: {[index]: { $set: task }}
    }));
  }

  detachTask(task) {
    const index = this.state.tasks.findIndex(t => t.id == task.id);
    if(index > -1) {
      this.setState(update(this.state, {
        tasks: {$splice: [[ index, 1 ]]},
        temps: {$push: [{ task, index }]}
      }));
    }
  }

  attachTask(task) {
    const tempIndex = this.state.temps.findIndex(t => t.task.id == task.id);
    if(tempIndex > -1) {
      const { task, index } = this.state.temps[tempIndex];
      this.setState(update(this.state, {
        tasks: {$splice: [[ index, 0, task ]]},
        temps: {$splice: [[ tempIndex, 1 ]]}
      }));
    }
  }

  handleTaskDeletion(task) {
    console.log(this.state.temps);
    const tempIndex = this.state.temps.findIndex(t => t.task.id === task.id);
    if(tempIndex > -1) {
      this.setState(update(this.state, {
        temps: {$splice: [[ tempIndex, 1 ]]}
      }))
    }
  }

  onSortEnd({ oldIndex, newIndex }) {
    const task = this.state.tasks[oldIndex];
    this.setState({
      tasks: arrayMove(this.state.tasks, oldIndex, newIndex)
    });
    if( oldIndex !== newIndex) {
      // this.updateTaskOrder(task, newIndex, newIndex);
    }
  }


  // move into task component
  // updateTaskOrder(task, order, prevOrder) {
  //   axios.put(`/api/tasks/${task.id}`, { order })
  //   .then(res => {
  //     this.setTaskOrder(order, order);
  //   })
  //   .catch(err => {
  //     if(this.props.onFailure) this.props.onFailure(err);
  //     this.setTaskOrder(order, prevOrder);
  //   });
  // }

  // setTaskOrder(index, order) {
  //   this.setState(update(this.state, {
  //     tasks: {
  //       [index]: {order: {$set: order}}
  //     }
  //   }))
  // }

  render() {
    const SortableTask = SortableElement(({ task, index }) => (
      <Task
        list={this.state.list}
        task={task}
        onTaskSaved={this.handleTaskSaved}
        onTaskDeleted={this.handleTaskDeletion}
        detachTask={this.detachTask}
        attachTask={this.attachTask}
      />
    ));
    const SortableTasks = SortableContainer(({tasks}) =>
      <div>
      {tasks.map((t, index) => (
        <SortableTask key={t.id || `new-${index}`} index={index} task={t} />
      ))}
      </div>
    );

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
          {this.state.loading ? 
            <CircularProgress size={24}/> : 
            <SortableTasks
              tasks={this.state.tasks}
              onSortEnd={this.onSortEnd}
              userDragHandle={true}
            />
          }
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
