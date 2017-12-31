import React, { Component } from 'react';
import axios from 'axios';

import List from 'material-ui/List/List';
import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';

import Storage from '../../modules/Storage';
import withCrud from '../withCrud';
import Preview from './Preview';
const CollectionPreview = withCrud(Preview);

class CollectionPreviews extends Component {
  constructor() {
    super();

    this.storage = new Storage('collections');
    this.creatable = true;

    this.state = {
      loading: !this.storage.data,
      collections: this.storage.data || [],
      removable: false
    };

    this.bindMethods();
  }

  bindMethods() {
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.newCollection = this.newCollection.bind(this);
    this.toggleRemovable = this.toggleRemovable.bind(this);
  }

  componentWillMount() {
    axios.get('/api/collections')
    .then(res => {
      const { last_update, collections } = res.data;
      if(this.storage.olderThan(last_update)) {
        this.storage.set(collections, last_update);
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

  handleCreate(collection) {
    const collections = this.state.collections.map(c => {
      if(c.id === "new") {
        this.creatable = true;
        return collection;
      }
      return c;
    });

    this.updateLocal(collections, collection.updated_at);
  }

  handleUpdate(collection) {
    const collections = this.state.collections.map(c => {
      if(c.id === collection.id) return collection;
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
        item={c}
        name="collection"
        pathname="/api/collections"
        removable={this.state.removable}
        onCreate={this.handleCreate}
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
