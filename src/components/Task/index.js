import React, { Component } from 'react';
import axios from 'axios';

import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import NavigationCancel from 'material-ui/svg-icons/navigation/cancel';
import CircularProgress from 'material-ui/CircularProgress';

import InputWithDelay from '../common/InputWithDelay';
import withCrud from '../hocs/withCrud';
import { isNew } from '../../modules/helpers';

class Task extends Component {
  handleUpdate(data) {
    const id = this.props.item.id;
    const task = { id, ...data };

    this.props.crud.update(task);
  }

  handleDelete() {
    if(!this.props.crud.loading) this.props.crud.delete(this.props.item);
  }

  render() {
    const { id, completed, title } = this.props.item;
    return (
      <div>
        <Checkbox
          checked={completed}
          onCheck={() => this.handleUpdate({ completed: !completed })}
          label={
            <InputWithDelay
              hintText={"Change task"}
              value={title}
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
        { this.props.crud.loading || isNew(id) ?
          <CircularProgress size={20} thickness={2} /> :
          <NavigationCancel />
        }
        </IconButton>
      </div>
    )
  }
}

export default withCrud({
  pathname: '/api/tasks',
  name: 'task'
})(Task);
