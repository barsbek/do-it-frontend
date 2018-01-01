import React, { Component } from 'react';
import update from 'immutability-helper';
import axios from 'axios';

import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';
import ContentClear from 'material-ui/svg-icons/content/clear';

import InputWithDelay from '../InputWithDelay';
import withCrud from '../withCrud';
import withItems from '../withItems';
import TaskCreateButton from './TaskCreateButton';
import Task from './Task';

class CollectionList extends Component {
  constructor(props) {
    super(props);

  }

  renderTasks() {
    return this.props.items.map((t, index) => (
      <Task
        key={t.id}
        item={t}
        {...this.props.handlers}
      />
    ))
  }

  render() {
    const { id, title } = this.props.item;
    return (
      <Paper zDepth={1} className="list">
        <Subheader style={{ paddingLeft: 0 }}>         
          <InputWithDelay
            value={title}
            name="title"
            onChangeStop={title => this.props.crud.change({ title })}
            fullWidth={true}
          />
          <IconButton onClick={
            () => this.props.crud.delete(this.props.item)
          }>
            <ContentClear />
          </IconButton>
        </Subheader>
        <div className="list-tasks">
          {this.renderTasks()}
        </div>
        <TaskCreateButton 
          listID={this.props.withID}
          { ...this.props.handlers }
        />
      </Paper>
    )
  }
}

const ListWithCrud = withCrud({
  name: "list",
  pathname: "/api/lists"
})(CollectionList);

export default withItems({
  pathname: "/api/lists",
  storageName: "list",
  itemsName: "tasks"
})(ListWithCrud);
