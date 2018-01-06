import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import update from 'immutability-helper';

import CircularProgress from 'material-ui/CircularProgress';

import './index.css';
import NewListButton from '../List/AddButton';
import withCrud      from '../hocs/withCrud';
import withItems     from '../hocs/withItems';
import Storage       from '../../modules/Storage';
import SortableLists from './SortableLists';

class Collection extends Component {
  handleNewList() {
    this.props.handlers.newItem({ title: '' });
  }

  render() {
    return (
      <div className="collection">
        <div className="collection-lists">
          { this.props.loading ?
            <CircularProgress /> :
            <SortableLists
              {...this.props}
              onSortEnd={this.props.handlers.onSortEnd} />
          }
        </div>
        <NewListButton
          onClick={this.handleNewList.bind(this)}
        />
      </div>
    );
  }
}

export default withItems({
  pathname: "/api/collections",
  storageName: "collection",
  itemsName: "lists"
})(Collection);
