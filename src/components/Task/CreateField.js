import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

import withCrud from '../hocs/withCrud';

class TaskCreateField extends Component {
  constructor(props) {
    super(props);

    this.addTask = this.addTask.bind(this);
    this.tempID = 1;
  }

  addTask(e) {
    const title = e.target.value;
    if(e.key === 'Enter' && title.trim()) {
      const list_id = this.props.listID;
      const task = { id: `new-${this.tempID}`, title, list_id }

      this.props.newItem(task, true, true);
      this.props.crud.create(task);
      e.target.value = '';
      this.tempID++;
    }
  }

  render() {
    return (
      <TextField
        hintText="+"
        onKeyPress={this.addTask}
        disabled={this.props.disabled}
        // move styles into separate file
        fullWidth={true}
        inputStyle={{ paddingLeft: 10 }}
        hintStyle={{ textAlign: 'center', width: '100%' }}
        underlineStyle={{ bottom: 0 }}
      />
    )
  }
}

export default withCrud({
  name: "task",
  pathname: "/api/tasks"
})(TaskCreateField);
