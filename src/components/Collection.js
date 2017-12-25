import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import update from 'immutability-helper';

import TitleTextField from './TitleTextField';
import List from './List';
import NewListButton from './NewListButton';

import './Collection.css';

class Collection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collection: null,
      lists: [],
      listID: null,
      tempNewList: false
    }
    this.handleTitleFocus = this.handleTitleFocus.bind(this);
    this.triggerTitleChange = this.triggerTitleChange.bind(this);
    this.addTempNewList = this.addTempNewList.bind(this);
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
    .catch(err => this.props.onFailure(err))
  }

  triggerTitleChange(title) {
    axios.put(`/api/lists/${this.state.listID}`, { title })
    .then(res => {
      // update this.state.lists
      console.log(res);
    })
    .catch(err => this.props.onFailure(err));
  }

  handleTitleFocus(listID) {
    this.setState({ listID });
  }

  addTempNewList() {
    if(!this.state.tempNewList) {
      this.setState(update(this.state, {
        lists: {$push: [{title: ''}]},
        tempNewList: {$set: true}
      }))
    }
  }

  render() {
    const lists = this.state.lists.map(item => (
      <List
        key={item.id || "new"} 
        title={item.title}
        onChangeFinish={this.triggerTitleChange}
        onTitleFocus={() => this.handleTitleFocus(item.id)}
      />
    ));
    return (
      <div className="collection">
        <div className="collection-lists">
          {lists}
        </div>
        <NewListButton onClick={this.addTempNewList}/>
      </div>
    );
  }
}

export default withRouter(Collection);
