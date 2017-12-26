import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import update from 'immutability-helper';

import List from './List';
import NewListButton from './NewListButton';

import './Collection.css';

class Collection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collection: null,
      lists: [],
      tempNewList: false
    }

    this.handleListCreation = this.handleListCreation.bind(this);
    this.addTempList = this.addTempList.bind(this);
  }

  componentWillMount() {
    this.getCollection(this.props.match.url);
    this.props.history.listen((location, action) => {
      this.getCollection(location.pathname);
    })
  }

  getCollection(pathname) {
    axios.get(`/api/${pathname}`)
    .then(res => {
      const collection = res.data.collection;
      const lists = res.data.lists;
      this.setState({ collection, lists });
    })
    .catch(this.props.onFailure);
  }

  handleListCreation(list) {
    this.setState(update(this.state, {
      lists: {
        [0]: { $set: list }
      },
      tempNewList: {$set: false}
    }))
  }

  addTempList() {
    if(!this.state.tempNewList) {
      this.setState(update(this.state, {
        lists: {$unshift: [{title: ''}]},
        tempNewList: {$set: true}
      }))
    }
  }

  render() {
    const lists = this.state.lists.map(item => (
      <List
        key={item.id || "new"}
        list={item}
        collection={this.state.collection}
        updateCollection={this.handleListCreation}
      />
    ));
    return (
      <div className="collection">
        <div className="collection-lists">
          {lists}
        </div>
        <NewListButton onClick={this.addTempList}/>
      </div>
    );
  }
}

export default withRouter(Collection);
