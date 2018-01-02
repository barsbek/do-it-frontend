import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import List from 'material-ui/List/List';
import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';

import Storage from '../../modules/Storage';
import withCrud from '../withCrud';
import withItems from '../withItems';
import CollectionPreview from './Preview';

class CollectionPreviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      removable: false,
      creatable: props.creatable
    }
  }
  
  componentWillUpdate(nextProps, nextState) {
    const { creatable, items } = this.props;
    const nextItems = nextProps.items;
    if(creatable && nextItems.length < items.length) {
      this.handleRemove(items, nextItems);
    }
  }

  handleRemove(items, nextItems) {
    for(let i in items) {
      i = parseInt(i);
      const item = items[i];
      if(nextItems.indexOf(item) > -1) continue;

      // TODO: redirect only on current collection's removal
      if(i+1 < items.length) {
        this.props.history.push(`/collections/${items[i+1].id}`)
      } else {
        if(items[0] === item) this.props.history.push('/');
        else this.props.history.push(`/collections/${items[0].id}`)
      }
    }
  }

  handleNewCollection() {
    const finish_at = new Date();
    const newCollection = { title: '', finish_at, id: "new" };
    
    this.props.handlers.newItem(newCollection);
  }

  toggleRemovable() {
    const removable = !this.state.removable;
    this.setState({ removable });
  }

  renderCollections() {
    return this.props.items.map((c, index) => (
      <CollectionPreview
        key={c.id}
        item={c}
        removable={this.state.removable}
        {...this.props.handlers}
      />
    ));
  }

  render() {
    if(this.props.loading) return <CircularProgress />
    return (
      <div className="collection-previews">
        <div className="collection-previews-actions">
          <IconButton onClick={this.handleNewCollection.bind(this)}>
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

const PreviewsWithRouter = withRouter(CollectionPreviews);

export default withItems({
  pathname: "/api/collections",
  storageName: "collections",
  itemsName: "collections"
})(PreviewsWithRouter);
