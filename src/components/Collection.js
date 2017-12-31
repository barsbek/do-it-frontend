import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import update from 'immutability-helper';

import CollectionList from './Collection/List';
import NewListButton from './NewListButton';
import withCrud from './withCrud';

import './Collection.css';
import Storage from '../modules/Storage';

const ListWithCrud = withCrud(CollectionList);

class Collection extends Component {
  constructor(props) {
    super(props);
    this.renderLists = this.renderLists.bind(this);
  }

  renderLists() {
    return this.props.items.map(item => (
      <ListWithCrud
        key={item.id || "new"}
        item={{...item, collection_id: this.props.id}}
        name="list"
        pathname="/api/lists"
        onCreate={this.props.onCreate}
        onUpdate={this.props.onUpdate}
        onDelete={this.props.onDelete}
      />
    ));
  }

  render() {
    return (
      <div className="collection">
        <div className="collection-lists">
          {this.renderLists()}
        </div>
        <NewListButton onClick={this.props.newItem}/>
      </div>
    );
  }
}

export default withRouter(Collection);
