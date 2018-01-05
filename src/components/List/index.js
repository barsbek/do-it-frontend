import React, { Component } from 'react';
import update from 'immutability-helper';
import axios from 'axios';

import Paper            from 'material-ui/Paper';
import Subheader        from 'material-ui/Subheader';
import TextField        from 'material-ui/TextField';
import Checkbox         from 'material-ui/Checkbox';
import CircularProgress from 'material-ui/CircularProgress';
import IconButton       from 'material-ui/IconButton';
import ContentClear     from 'material-ui/svg-icons/content/clear';

import InputWithDelay from '../common/InputWithDelay';
import AlertDialog    from '../common/AlertDialog';

import withCrud   from '../hocs/withCrud';
import withItems  from '../hocs/withItems';

import TaskCreateField  from '../Task/CreateField';
import Task             from '../Task';
import Storage          from '../../modules/Storage';
import { isNew }        from '../../modules/helpers';

const STORAGE_NAME = 'list';

class CollectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
    }

    this.handleDialogDelete = this.handleDialogDelete.bind(this);
    this.handleDeleteButton = this.handleDeleteButton.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  componentWillUnmount() {
    if(!isNew( this.props.item.id )) this.clearSubitems()
  }

  clearSubitems() {
    const subItemsStorage = `${STORAGE_NAME}-${this.props.item.id}`;
    Storage.delete(subItemsStorage);
  }

  handleDialogDelete() {
    this.props.crud.delete(this.props.item);
    this.closeDialog();
  }

  handleDeleteButton() {
    if(this.props.crud.loading) return false;
    if(!isNew( this.props.item )) this.setState({ dialogOpen: true });
    else             this.props.crud.delete(this.props.item);
  }

  closeDialog() {
    this.setState({ dialogOpen: false });
  }

  renderTasks() {
    return this.props.items.map((t, index) => (
      <Task
        key={t.id}
        item={t}
        {...this.props.handlers}
        notifiers={this.props.notifiers}
      />
    ))
  }

  render() {
    const { id, title } = this.props.item;
    return (
      <Paper zDepth={1} className="list">
        <Subheader style={{ paddingLeft: 0 }}>         
          <InputWithDelay
            focus={isNew(id)}
            value={title}
            name="title"
            onChangeStop={title => this.props.crud.change({ title })}
            fullWidth={true}
          />
          <IconButton onClick={this.handleDeleteButton}>
            { this.props.crud.loading ? 
              <CircularProgress size={20} thickness={2} /> :
              <ContentClear />
            }
          </IconButton>
        </Subheader>
        <div className="list-tasks">
          {this.props.loading && !isNew(id) ? 
            <CircularProgress /> :
            this.renderTasks()
          }
        </div>
        <TaskCreateField 
          listID={this.props.withID}
          disabled={isNew(this.props.withID)}
          { ...this.props.handlers }
          notifiers={this.props.notifiers}
        />
        <AlertDialog
          open={this.state.dialogOpen}
          title="Delete list?"
          onApprove={this.handleDialogDelete}
          onClose={this.closeDialog}
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
  storageName: STORAGE_NAME,
  itemsName: "tasks"
})(ListWithCrud);
