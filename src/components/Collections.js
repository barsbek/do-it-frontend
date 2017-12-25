import React, { Component } from 'react';
import { List, ListItem } from 'material-ui/List';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Collections extends Component {
  constructor() {
    super();
    this.state = { list: [] };
  }

  componentWillMount() {
    axios.get('/api/collections')
    .then(res => {
      this.setState({ list: res.data.collections });
    })
    .catch(err => this.props.notifyErrorResponse(err))
  }

  render() {
    const collections = this.state.list.map(collection => (
      <ListItem key={collection.id}>
        <Link to={`/collections/${collection.id}`} >
          {collection.title}
        </Link>
      </ListItem>
    ));

    return ( <List>{collections}</List> )
  }
}

export default Collections;
