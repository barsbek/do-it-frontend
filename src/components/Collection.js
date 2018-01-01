import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import update from 'immutability-helper';

import NewListButton from './NewListButton';
import withCrud from './withCrud';
import withItems from './withItems';
import CollectionList from './Collection/List';

import './Collection.css';
import Storage from '../modules/Storage';

class Collection extends Component {
  constructor(props) {
    super(props);
  }

  renderLists() {
    return this.props.items.map(item => (
      <CollectionList
        key={item.id}
        withID={item.id}
        item={{...item, collection_id: this.props.withID}}
        {...this.props.handlers}
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
          () => {
            this.props.handlers.newItem({ title: '' })
          }
        }/>
      </div>
    );
  }
}

export default withItems({
  pathname: "/api/collections",
  storageName: "collection",
  itemsName: "lists"
})(Collection);
