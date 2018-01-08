import React, { Component } from 'react';
import update from 'immutability-helper';
import axios from 'axios';
import { SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';

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
import SortableTasks    from './SortableTasks';
import Storage          from '../../modules/Storage';
import { isNew }        from '../../modules/helpers';

import styles from './index.css';

const STORAGE_NAME = 'list';
const DragHandle = SortableHandle(() => 
  <span className={styles.Sorter}></span>
);

class CollectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
    }

    this.handleDialogDelete = this.handleDialogDelete.bind(this);
    this.handleDeleteButton = this.handleDeleteButton.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  componentWillUnmount() {
    if(!isNew( this.props.item.id )) this.clearSubitems()
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.moved && this.props.moved !== nextProps.moved) {
      this.props.crud.update({ position: nextProps.moved });
    }
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

  handleSort(data) {
    this.props.handlers.onSortEnd(data);
  }

  renderTasks() {
    return (
      <SortableTasks
        moved={this.props.moved}
        items={this.props.items}
        handlers={this.props.handlers}
        notifiers={this.props.notifiers}
        onSortEnd={this.handleSort}
      />
    );
  }

  render() {
    const { id, title } = this.props.item;
    return (
      <Paper zDepth={1} className={styles.List}>
        <Subheader className={styles.Header}>         
          <InputWithDelay
            className={styles.Title}
            focus={isNew(id)}
            value={title}
            name="title"
            underlineShow={false}
            onChangeStop={title => this.props.crud.change({ title })}
            fullWidth={true}
          />
          <IconButton
            className={styles.ButtonDelete}
            onClick={this.handleDeleteButton}>
            { this.props.crud.loading ? 
              <CircularProgress size={20} thickness={2} /> :
              <ContentClear />
            }
          </IconButton>
        </Subheader>
        {this.props.loading && !isNew(id) ? 
          <CircularProgress className={styles.LoadingAnimation}/> :
          this.renderTasks()
        }
        <TaskCreateField 
          className={styles.TaskCreate}
          listID={this.props.withID}
          disabled={isNew(this.props.withID)}
          handlers={this.props.handlers}
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

// move into separate components
const SortableList = SortableElement(props => (
  <CollectionList {...props} />
));

const ListWithItems = withItems({
  pathname: "/api/lists",
  storageName: STORAGE_NAME,
  itemsName: "tasks"
})(SortableList);

const ListWithCrud = withCrud({
  name: "list",
  pathname: "/api/lists"
})(ListWithItems);

export default ListWithCrud;
