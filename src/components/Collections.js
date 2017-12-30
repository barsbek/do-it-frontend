import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { List, ListItem } from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import axios from 'axios';

class Collections extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      list: []
    };
  }

  componentWillMount() {
    axios.get('/api/collections')
    .then(res => {
      this.setState({ list: res.data.collections, loading: false });
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
    return this.state.list.map(c => (
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
