import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import ListItem from 'material-ui/List/ListItem';
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
    this.showTimePicker = this.showTimePicker.bind(this);
    this.updateFinishAt = this.updateFinishAt.bind(this);
    this.handleIconClick = this.handleIconClick.bind(this);
  }

  handleIconClick() {
    const { id } = this.props.item;
    if(this.props.removable) {
      this.props.delete(id);
    } else if(id !== "new") {
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
    const { id, title, finish_at } = this.props.item;
    return (
      <ListItem
        style={{ height: 50 }}
        primaryText={
          <InputWithDelay
            name="title"
            value={title}
            focus={ id === "new" }
            onChangeStop={title => this.props.change({ title })}
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
              name="date"
              value={new Date(finish_at)}
              autoOk={true}
              onChange={this.showTimePicker}
            />
            <TimePicker
              ref="timepicker"
              name="time"
              autoOk={true}
              value={new Date(finish_at)}
              onChange={this.updateFinishAt}
            />
          </div>
        }
        rightIconButton={
          <IconButton
            disabled={ id === "new" && !this.props.removable }
            onClick={this.handleIconClick} style={{ zIndex: 2 }}>
            {this.props.removable ? <ContentClear /> : <ArrowForward />}
          </IconButton>
        }
      />
    )
  }
}

export default withRouter(CollectionPreview);
