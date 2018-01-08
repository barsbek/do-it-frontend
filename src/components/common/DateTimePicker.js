import React, { Component } from 'react';
import moment from 'moment';

import DatePicker   from 'material-ui/DatePicker'
import TimePicker   from 'material-ui/TimePicker';

const styles = {
  Button: {
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontSize: 12,
    color: '#444',
    width: '100%',
    textAlign: 'left'
  }
}

class DateTimePicker extends Component {
  constructor(props) {
    super(props);
    this.showTimePicker = this.showTimePicker.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  showTimePicker(_, date) {
    this.refs.timepicker.openDialog();
    this.date = date;
  }

  handleChange(_, time) {
    const mTime = moment(time);
    const mDate = moment(this.date);
    const dateTime = moment({
      year: mDate.year(),
      month: mDate.month(),
      day: mDate.date(),
      hour: mTime.hours(),
      minute: mTime.minutes(),
      second: mTime.seconds()
    }).toString();

    this.props.onChange(dateTime);
  }

  render() {
    return [
      <button
        key="date-time-button"
        style={styles.Button}
        onClick={() => this.refs.datepicker.openDialog()}
      >{this.props.buttonLabel}</button>,
      <DatePicker
        key="datepicker"
        ref="datepicker"
        name="date"
        value={new Date(this.props.value)}
        autoOk={true}
        style={{display: 'none'}}
        onChange={this.showTimePicker}
      />,
      <TimePicker
        key="timepicker"
        ref="timepicker"
        name="time"
        autoOk={true}
        value={new Date(this.props.value)}
        style={{display: 'none'}}
        onChange={this.handleChange}
      />
    ];
  }
}

export default DateTimePicker;
