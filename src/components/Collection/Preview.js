import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import ListItem from 'material-ui/List/ListItem';
import TextField from 'material-ui/TextField';

class CollectionPreview extends Component {
  constructor(props) {
    super(props);

    this.bindMethods();
  }

  bindMethods() {
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { id } = this.props.collection;
    this.props.history.push(`/collections/${id}`);
  }

  render() {
    const { title, finish_at } = this.props.collection;
    return (
      <ListItem
        primaryText={<TextField value={title} />}
        secondaryText={finish_at}
        onClick={this.handleClick}
      />
    )
  }
}

export default withRouter(CollectionPreview);
