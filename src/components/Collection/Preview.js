import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import ListItem from 'material-ui/List/ListItem';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';

import InputWithDelay from '../InputWithDelay'

class CollectionPreview extends Component {
  constructor(props) {
    super(props);

    this.bindMethods();
  }

  bindMethods() {
    this.openCollection = this.openCollection.bind(this);
    this.updateCollection = this.updateCollection.bind(this);
  }

  openCollection() {
    const { id } = this.props.collection;
    this.props.history.push(`/collections/${id}`);
  }

  updateCollection(title) {
    const { id } = this.props.collection;
    axios.put(`/api/collections/${id}`, { title })
    .then(res => {
      this.props.onUpdate(res.data);
    })
    .catch(err => alert(err));
  }

  render() {
    const { title, finish_at } = this.props.collection;
    return (
      <ListItem
        primaryText={
          <InputWithDelay
            name="title"
            value={title}
            onChangeStop={this.updateCollection}
          />
        }
        disabled={true}
        secondaryText={finish_at}
        rightIconButton={
          <IconButton
            onClick={this.openCollection} style={{ zIndex: 2 }}>
            <ArrowForward />
          </IconButton>
        }
      />
    )
  }
}

export default withRouter(CollectionPreview);
