import React, { Component } from 'react';
import { List, ListItem } from 'material-ui/List';

class Collections extends Component {
  render() {
    const collections = this.props.list.map(collection => (
      <ListItem
        key={collection.id}
        primaryText={collection.title}
        secondaryText={collection.finish_at} />
    ))
    return (
      <List>{collections}</List>
    )
  }
}

export default Collections;
