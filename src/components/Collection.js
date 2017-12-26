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
      listID: null,
      tempNewList: false
    }

    this.triggerTitleChange = this.triggerTitleChange.bind(this);
    this.updateRemoteList = this.updateRemoteList.bind(this);
    this.updateLocalList = this.updateLocalList.bind(this);
    this.handleListCreation = this.handleListCreation.bind(this);
    this.addTempNewList = this.addTempNewList.bind(this);
    this.handleTitleFocus = this.handleTitleFocus.bind(this);
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

  triggerTitleChange(title) {
    if(this.state.listID) {
      this.updateRemoteList(this.state.listID, title);
    } else {
      const collection_id = this.state.collection.id;
      axios.post(`/api/lists`, { title, collection_id })
      .then(this.handleListCreation)
      .catch(this.props.onFailure);
      // remove or save to local storage on creation failure
    }
  }

  updateRemoteList(listID, title) {
    axios.put(`/api/lists/${listID}`, { title })
    .then(res => {
      const index = this.state.lists.findIndex(x => x.id == this.state.listID);
      if(index > -1) this.updateLocalList(index, res.data)
    })
    .catch(this.props.onFailure);
  }

  updateLocalList(index, data) {
    this.setState(update(this.state, {
      lists: {[index]: {$set: data}}
    }))
  }

  handleListCreation(res) {
    const lists = this.state.lists;
    const data = { id: res.data.id, title: res.data.title }
    this.updateLocalList(lists.length - 1, data);
    this.setState({ tempNewList: false });
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
        id={item.id}
        title={item.title}
        onTitleChange={this.triggerTitleChange}
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
