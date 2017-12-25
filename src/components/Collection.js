import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';

import TitleTextField from './TitleTextField';

import './Collection.css';

class Collection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collection: null,
      lists: [],
      listID: null
    }
    this.handleTitleFocus = this.handleTitleFocus.bind(this);
    this.triggerTitleChange = this.triggerTitleChange.bind(this);
  }

  componentWillMount() {
    this.getCollection(this.props.match.url);
    this.props.history.listen((location, action) => {
      this.getCollection(location.pathname);
    })
  }

  getCollection(pathname) {
    axios.get(`/api/${pathname}`)
    .then(res => {
      const collection = res.data.collection;
      const lists = res.data.lists;
      this.setState({ collection, lists });
    })
    .catch(err => this.props.onFailure(err))
  }

  triggerTitleChange(title) {
    axios.put(`/api/lists/${this.state.listID}`, { title })
    .then(res => {
      // update this.state.lists
      console.log(res);
    })
    .catch(err => this.props.onFailure(err));
  }

  handleTitleFocus(listID) {
    this.setState({ listID });
  }

  render() {
    const lists = this.state.lists.map(item => (
      <Paper key={item.id} zDepth={1} className="collection-list">
        <Subheader style={{ paddingLeft: 0 }} >         
          <TitleTextField
            value={item.title}
            onChangeFinish={this.triggerTitleChange}
            onFocus={(e) => this.handleTitleFocus(item.id)} 
          />
        </Subheader>

        <TextField
          fullWidth={true}
          inputStyle={{ paddingLeft: 10 }}
          hintStyle={{ textAlign: 'center', width: '100%' }}
          underlineStyle={{ bottom: 0 }}
          className="collection-new-task"
          hintText="+" />
      </Paper>
    ));
    return (
      <div className="collection">
        {lists}
      </div>
    );
  }
}

export default withRouter(Collection);
