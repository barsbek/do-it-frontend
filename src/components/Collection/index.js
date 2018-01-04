import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import update from 'immutability-helper';

import CircularProgress from 'material-ui/CircularProgress';

import './index.css';
import NewListButton from '../List/AddButton';
import withCrud      from '../hocs/withCrud';
import withItems     from '../hocs/withItems';
import List          from '../List';
import Storage       from '../../modules/Storage';

class Collection extends Component {
  handleNewList() {
    this.props.handlers.newItem({ title: '' });
  }

  renderLists() {
    return this.props.items.map(item => (
      <List
        key={item.id}
        withID={item.id}
        item={{...item, collection_id: this.props.withID}}
        {...this.props.handlers}
        notifiers={this.props.notifiers}
      />
    ));
  }

  render() {
    return (
      <div className="collection">
        <div className="collection-lists">
          {this.props.loading ? <CircularProgress /> : this.renderLists()}
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
