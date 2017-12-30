import React, { Component } from 'react';
import axios from 'axios';
import update from 'immutability-helper';
import moment from 'moment';

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

    this.storage = new Storage('collections');
    this.creatable = true;

    this.state = {
      loading: !this.storage.data,
      collections: this.storage.data || []
    };

    this.bindMethods();
  }

  bindMethods() {
    this.handleUpdate = this.handleUpdate.bind(this);
    this.newCollection = this.newCollection.bind(this);
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

  handleUpdate(collection, newCollection=false) {
    const collections = this.state.collections.map(c => {
      if(!newCollection && c.id === collection.id) return collection;
      if(newCollection && c.id === "new") {
        this.creatable = true;
        return collection;
      }
      return c;
    });

    this.storage.set(collections, collection.updated_at);
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

  renderCollections() {
    return this.state.collections.map((c, index) => (
      <CollectionPreview
        key={c.id || "new"}
        collection={c}
        onUpdate={this.handleUpdate}
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
          <IconButton>
            <ContentRemove />
          </IconButton>
        </div>
        <List>{this.renderCollections()}</List>
      </div>
    )
  }
}

export default CollectionPreviews;
