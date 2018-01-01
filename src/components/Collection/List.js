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
// import Task from './Task';

class CollectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      temps: [],
      loading: true,
    };
  }

  renderTasks() {
    this.state.tasks.map((t, index) => {
      <div key={t.id || "new"}>{t.title}</div>
      // <Task
      //   key={t.id || "new"}
      //   list={this.props.list}
      //   task={t}
      // />
    })
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
          {/* {this.state.loading ? 
            <CircularProgress size={24}/> : 
            this.renderTasks()
          } */}
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

const ListWithCrud = withCrud({
  name: "list",
  pathname: "/api/lists"
})(CollectionList);

export default withItems({
  pathname: "/api/lists",
  storageName: "list",
  itemsName: "tasks"
})(ListWithCrud);
