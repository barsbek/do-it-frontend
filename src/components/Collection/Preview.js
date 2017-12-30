import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import ListItem from 'material-ui/List/ListItem';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import DatePicker from 'material-ui/DatePicker'
import TimePicker from 'material-ui/TimePicker';
import RaisedButton from 'material-ui/RaisedButton';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import ContentClear from 'material-ui/svg-icons/content/clear';

import InputWithDelay from '../InputWithDelay'

class CollectionPreview extends Component {
  constructor(props) {
    super(props);

    this.bindMethods();
  }

  bindMethods() {
    this.openCollection = this.openCollection.bind(this);
    this.showTimePicker = this.showTimePicker.bind(this);
    this.updateFinishAt = this.updateFinishAt.bind(this);
    this.handleIconClick = this.handleIconClick.bind(this);
  }

  openCollection() {

  }

  updateCollection(data) {
    const { id } = this.props.collection;

    axios.put(`/api/collections/${id}`, data)
    .then(res => {
      this.props.onUpdate(res.data);
    })
    .catch(err => alert(err));
  }

  createCollection(data) {
    axios.post('/api/collections', data)
    .then(res => {
      this.props.onUpdate(res.data, true);
    })
    .catch(err => alert(err));
  }

  deleteCollection(id) {
    axios.delete(`/api/collections/${id}`)
    .then(res => {
      this.props.onDelete(res.data);
    })
    .catch(err => alert(err));
  }

  handleChange(data) {
    const c = {...this.props.collection, ...data};
    if(this.props.collection.id === "new") {
      this.createCollection(c);
    } else {
      this.updateCollection(c);
    }
  }

  handleIconClick() {
    const { id } = this.props.collection;
    if(this.props.removable) {
      this.deleteCollection(id);
    } else {
      this.props.history.push(`/collections/${id}`);
    }
  }

  showTimePicker(_, date) {
    this.refs.timepicker.openDialog();
    this.date = date;
  }

  updateFinishAt(_, time) {
    const mTime = moment(time);
    const mDate = moment(this.date);
    const finish_at = moment({
      year: mDate.year(),
      month: mDate.month(),
      day: mDate.date(),
      hour: mTime.hours(),
      minute: mTime.minutes(),
      second: mTime.seconds()
    }).toString();

    this.handleChange({ finish_at });
  }

  render() {
    const { id, title, finish_at } = this.props.collection;
    return (
      <ListItem
        style={{ height: 50 }}
        primaryText={
          <InputWithDelay
            name="title"
            value={title}
            onChangeStop={title => this.handleChange({ title })}
            style={{ height: 34, width: 180 }}
          />
        }
        disabled={true}
        secondaryText={
          <div>
            <RaisedButton
              label={moment(finish_at).format('llll')}
              onClick={() => this.refs.datepicker.openDialog()}
              style={{ margin: 0, fontSize: 12, height: 26 }}
            />
            <DatePicker
              ref="datepicker"
              value={new Date(finish_at)}
              autoOk={true}
              onChange={this.showTimePicker}
            />
            <TimePicker
              ref="timepicker"
              autoOk={true}
              value={new Date(finish_at)}
              onChange={this.updateFinishAt}
            />
          </div>
        }
        rightIconButton={
          <IconButton
            onClick={this.handleIconClick} style={{ zIndex: 2 }}>
            {this.props.removable ? <ContentClear /> : <ArrowForward />}
          </IconButton>
        }
      />
    )
  }
}

export default withRouter(CollectionPreview);
