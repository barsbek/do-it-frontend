import React, { Component } from 'react';
import axios from 'axios';

import List from 'material-ui/List/List';
import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';

import Storage from '../../modules/Storage';
import withCrud from '../withCrud';
import withLocalStorage from '../withLocalStorage';
import PreviewWithCrud from './Preview';

class CollectionPreviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      removable: false,
      creatable: props.creatable
    }
  }

  newCollection() {
    const finish_at = new Date();
    const newCollection = { title: '', finish_at, id: "new" };
    
    this.props.storage.newItem(newCollection);
  }

  toggleRemovable() {
    const removable = !this.state.removable;
    this.setState({ removable });
  }

  renderCollections() {
    return this.props.items.map((c, index) => (
      <PreviewWithCrud
        key={c.id || "new"}
        item={c}
        name="collection"
        pathname="/api/collections"
        removable={this.state.removable}
        {...this.props.storage}
      />
    ));
  }

  render() {
    if(this.props.loading) return <CircularProgress />
    return (
      <div className="collection-previews">
        <div className="collection-previews-actions">
          <IconButton onClick={this.newCollection.bind(this)}>
            <ContentAdd />
          </IconButton>
          <IconButton onClick={this.toggleRemovable.bind(this)}>
            <ContentRemove />
          </IconButton>
        </div>
        <List>{this.renderCollections()}</List>
      </div>
    )
  }
}

export default withLocalStorage(CollectionPreviews);
