import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { List, ListItem } from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import axios from 'axios';

import Storage from '../modules/Storage';

class Collections extends Component {
  constructor() {
    super();

    this.storage = new Storage('collections');
    console.log(this.storage.get());
    this.state = {
      loading: !this.storage.get(),
      collections: this.storage.get() || []
    };
  }

  componentWillMount() {
    axios.get('/api/collections')
    .then(res => {
      const { last_update, collections } = res.data;
      if(this.storage.outOfDate(last_update)) {
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

  handleItemClick(id) {
    this.props.history.push(`/collections/${id}`)
  }

  renderCollections() {
    return this.state.collections.map(c => (
      <ListItem key={c.id}
        primaryText={c.title}
        secondaryText={c.finish_at}
        onClick={() => this.handleItemClick(c.id)} />
    ));
  }

  render() {
    if(this.state.loading) return <CircularProgress />
    return <List>{this.renderCollections()}</List>
  }
}

export default withRouter(Collections);
