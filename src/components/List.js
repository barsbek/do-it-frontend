import React, { Component } from 'react';
import update from 'immutability-helper';
import axios from 'axios';

import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

import InputWithDelay from './InputWithDelay';
// import Task from './Task';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: this.props.list,
      tasks: []
    };

    this.handleTitleChange = this.handleTitleChange.bind(this);
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
      console.log(res.data);
      this.setState({ list: res.data });
    })
    .catch(this.props.onFailure);
  }

  render() {
    
    const tasks = [];
    // this.state.tasks.map(t => (
    //   <Task
    //     key={t.id}
    //     task={t}
    //   />
    // ));

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
        {/* <TaskField
          className="collection-new-task"
          hintText="+"

          fullWidth={true}
          inputStyle={{ paddingLeft: 10 }}
          hintStyle={{ textAlign: 'center', width: '100%' }}
          underlineStyle={{ bottom: 0 }}
        /> */}
      </Paper>
    )
  }
}

export default List;
