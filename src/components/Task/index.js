import React, { Component } from 'react';
import { SortableElement } from 'react-sortable-hoc';

import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import NavigationCancel from 'material-ui/svg-icons/navigation/cancel';
import CircularProgress from 'material-ui/CircularProgress';

import InputWithDelay from '../common/InputWithDelay';
import withCrud from '../hocs/withCrud';
import { isNew } from '../../modules/helpers';
import DragHandle from '../common/DragHandle';

import styles from './index.css';

class Task extends Component {
  componentWillReceiveProps(nextProps) {
    const { moved, item } = this.props;
    if(nextProps.moved && moved !== nextProps.moved) {
      item.position = nextProps.moved;
      this.props.crud.update(item);  
    }
  }

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
      <div className={styles.Task}>
        <DragHandle disabled={isNew( id )}>
          ::
        </DragHandle>
        <Checkbox
          style={{ width: 'auto' }}
          iconStyle={{ marginRight: 4 }}
          checked={completed}
          onCheck={() => this.handleUpdate({ completed: !completed })}
        />
        <InputWithDelay
          hintText={"Change task"}
          value={title}
          onChangeStop={title => this.handleUpdate({ title })}
          underlineShow={false}
          style={{ zIndex: 2, height: 34, paddingTop: 6 }}
        />
        <IconButton
          style={{ height: 40, padding: 6, width: 40 }}
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

const TaskWithCrud = withCrud({
  pathname: '/api/tasks',
  name: 'task'
})(Task);

export default SortableElement(TaskWithCrud);
