import React, { Component } from 'react';
import axios from 'axios';

import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import NavigationCancel from 'material-ui/svg-icons/navigation/cancel';

import InputWithDelay from '../InputWithDelay';
import withCrud from '../withCrud';

class Task extends Component {
  handleUpdate(data) {
    const id = this.props.item.id;
    const task = { id, ...data };

    this.props.crud.update(task);
  }

  handleDelete() {
    this.props.crud.delete(this.props.item);
  }

  render() {
    return (
      <div>
        <Checkbox
          checked={this.props.item.completed}
          onCheck={() => this.handleUpdate({ completed: !this.props.item.completed })}
          label={
            <InputWithDelay
              hintText={"Change task"}
              value={this.props.item.title}
              onChangeStop={title => this.handleUpdate({ title })}
              underlineShow={false}
              style={{ zIndex: 2 }}
            />
          }
        />
        <IconButton
          className="task-delete-button"
          onClick={this.handleDelete.bind(this)}
        >
          <NavigationCancel />
        </IconButton>
      </div>
    )
  }
}

export default withCrud({
  pathname: '/api/tasks',
  name: 'task'
})(Task);
