import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import ListItem from 'material-ui/List/ListItem';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import DatePicker from 'material-ui/DatePicker'
import TimePicker from 'material-ui/TimePicker';
import RaisedButton from 'material-ui/RaisedButton';

import InputWithDelay from '../InputWithDelay'

class CollectionPreview extends Component {
  constructor(props) {
    super(props);

    this.bindMethods();
  }

  bindMethods() {
    this.openCollection = this.openCollection.bind(this);
    this.updateCollection = this.updateCollection.bind(this);
    this.showTimePicker = this.showTimePicker.bind(this);
    this.updateFinishAt = this.updateFinishAt.bind(this);
  }

  openCollection() {
    const { id } = this.props.collection;
    this.props.history.push(`/collections/${id}`);
  }

  updateCollection(data) {
    const { id } = this.props.collection;
    axios.put(`/api/collections/${id}`, data)
    .then(res => {
      this.props.onUpdate(res.data);
    })
    .catch(err => alert(err));
  }

  showTimePicker(temp, date) {
    this.refs.timepicker.openDialog();
    this.date = date;
  }

  updateFinishAt(temp, time) {
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
    this.updateCollection({ finish_at });
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
            onChangeStop={title => this.updateCollection({ title })}
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
            onClick={this.openCollection} style={{ zIndex: 2 }}>
            <ArrowForward />
          </IconButton>
        }
      />
    )
  }
}

export default withRouter(CollectionPreview);
