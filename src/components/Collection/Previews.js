import React, { Component } from 'react';
import axios from 'axios';

import List from 'material-ui/List/List';
import CircularProgress from 'material-ui/CircularProgress';

import Storage from '../../modules/Storage';
import CollectionPreview from './Preview';

class CollectionPreviews extends Component {
  constructor() {
    super();

    this.storage = new Storage('collections');

    this.state = {
      loading: !this.storage.data,
      collections: this.storage.data || []
    };

    this.bindMethods();
  }

  bindMethods() {
    this.handleUpdate = this.handleUpdate.bind(this);
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

  handleUpdate(collection) {
    const newData = this.storage.data.map(c => {
      if(c.id === collection.id) return collection;
      return c;
    });

    this.storage.set(newData, collection.updated_at);
  }

  renderCollections() {
    return this.state.collections.map((c, index) => (
      <CollectionPreview
        key={index}
        collection={c}
        onUpdate={this.handleUpdate}
      />
    ));
  }

  render() {
    if(this.state.loading) return <CircularProgress />
    return <List>{this.renderCollections()}</List>
  }
}

export default CollectionPreviews;
