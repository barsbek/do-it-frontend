import React, { Component } from 'react';
import axios from 'axios';
import querystring from 'querystring';

import List from 'material-ui/List/List';
import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';

import Storage from '../../modules/Storage';
import CollectionPreview from './Preview';

class CollectionPreviews extends Component {
  constructor() {
    super();

    this.creatable = true;
    this.storage = new Storage('collections');
    const data = this.storage.getPage(1);

    this.state = {
      loading: !data,
      collections: data || [],
      removable: false
    };

    this.bindMethods();
  }

  bindMethods() {
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.newCollection = this.newCollection.bind(this);
    this.toggleRemovable = this.toggleRemovable.bind(this);
  }

  componentWillMount() {
    this.getCollections(1);
  }

  getCollections(page = 1) {
    axios.get(`/api/collections?page=${page}`)
    .then(res => {
      const { last_update, collections } = res.data;
      if(this.storage.olderThan(last_update, page)) {
        const s = {collections, updated_at: last_update};
        this.storage.set(s, page);
        this.setState({ collections, loading: false });
      } else {
        this.setState({ loading: false })
      }
    })
    .catch(err => {
      alert(err);
      this.setState({ loading: false });
    });
  }

  handleUpdate(collection, newCollection=false) {
    const collections = this.state.collections.map(c => {
      if(!newCollection && c.id === collection.id) return collection;
      if(newCollection && c.id === "new") {
        this.creatable = true;
        return collection;
      }
      return c;
    });

    this.updateLocal(collections, collection.updated_at);
  }

  handleDelete(data) {
    let { collection, last_update } = data;
    const collections = this.state.collections.filter(c => {
      return c.id !== collection.id; 
    });

    last_update = last_update ? last_update : this.lastUpdateFrom(collections);
    if(collection.id === 'new') this.creatable = true;
    this.updateLocal(collections, last_update);
  }

  lastUpdateFrom(cs) {
    if(cs.length > 0) {
      const initial = Date.parse(cs[0].updated_at);
      return cs.reduce((maxDate, c) => (
        Math.max(maxDate, Date.parse(c.updated_at)) 
      ), initial);
    }
    return null;
  }

  updateLocal(collections, last_update) {
    this.storage.set(collections, last_update);
    this.setState({ collections });
  }

  newCollection() {
    if(this.creatable) {
      const finish_at = new Date();
      const newCollection = { title: '', finish_at, id: "new" };
      this.setState(prevState => ({
        collections: [newCollection, ...prevState.collections]
      }));
      this.creatable = false;
    }
  }

  toggleRemovable() {
    const removable = !this.state.removable;
    this.setState({ removable });
  }

  renderCollections() {
    return this.state.collections.map((c, index) => (
      <CollectionPreview
        key={c.id || "new"}
        collection={c}
        removable={this.state.removable}
        onUpdate={this.handleUpdate}
        onDelete={this.handleDelete}
      />
    ));
  }

  render() {
    if(this.state.loading) return <CircularProgress />
    return (
      <div className="collection-previews">
        <div className="collection-previews-actions">
          <IconButton onClick={this.newCollection}>
            <ContentAdd />
          </IconButton>
          <IconButton onClick={this.toggleRemovable}>
            <ContentRemove />
          </IconButton>
        </div>
        <List>{this.renderCollections()}</List>
      </div>
    )
  }
}

export default CollectionPreviews;
