import React, { Component } from 'react';
import { List, ListItem } from 'material-ui/List';
import { Link, withRouter } from 'react-router-dom';
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

  handleItemClick(id) {
    this.props.history.push(`/collections/${id}`)
  }

  render() {
    const collections = this.state.list.map(c => (
      <ListItem key={c.id}
        primaryText={c.title}
        secondaryText={c.finish_at}
        onClick={() => this.handleItemClick(c.id)} />
    ));

    return ( <List>{collections}</List> )
  }
}

export default withRouter(Collections);
