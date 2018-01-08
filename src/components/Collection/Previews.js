import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';

import withItems from '../hocs/withItems';
import SortablePreviews from './SortablePreviews';

import styles from './Previews.css.js';

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
      i = parseInt(i, 10);
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
    const newCollection = { title: '', finish_at };
    
    this.props.handlers.newItem(newCollection);
  }

  toggleRemovable() {
    const removable = !this.state.removable;
    this.setState({ removable });
  }

  render() {
    if(this.props.loading) return <CircularProgress />
    return (
      <div>
        <div style={styles.Actions}>
          <IconButton
            style={styles.ActionButton}
            onClick={this.handleNewCollection.bind(this)}>
            <ContentAdd />
          </IconButton>
          <IconButton
            style={styles.ActionButton}
            onClick={this.toggleRemovable.bind(this)}>
            <ContentRemove />
          </IconButton>
        </div>
        <SortablePreviews
          {...this.props}
          removable={this.state.removable}
          onSortEnd={this.props.handlers.onSortEnd}
        />
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
