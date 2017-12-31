import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import update from 'immutability-helper';

import NewListButton from './NewListButton';
import withCrud from './withCrud';
import withLocalStorage from './withLocalStorage';
import CollectionList from './Collection/List';

import './Collection.css';
import Storage from '../modules/Storage';

class Collection extends Component {
  constructor(props) {
    super(props);
    this.renderLists = this.renderLists.bind(this);
  }

  renderLists() {
    return this.props.items.map(item => (
      <CollectionList
        withID={item.id}
        key={item.id || "new"}
        item={{...item, collection_id: this.props.id}}
        {...this.props.storage}
      />
    ));
  }

  render() {
    return (
      <div className="collection">
        <div className="collection-lists">
          {this.renderLists()}
        </div>
        <NewListButton onClick={
          () => this.props.storage.newItem({ id: "new", title: '' })
        }/>
      </div>
    );
  }
}

export default withLocalStorage(Collection, {
  pathname: "/api/collections",
  storageName: "collection",
  itemsName: "lists"
});
