import React, { Component } from 'react';

import TextField from 'material-ui/TextField';

class DelayChangeInput extends Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value }
    this.delay = this.props.delay || 600;

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentWillMount() {
    this.timer = null;
  }

  handleChange(e) {
    const value = e.target.value;
    clearTimeout(this.timer);
    this.setState({ value })
    this.timer = setTimeout(
      () => this.props.onChange(value),
    this.delay);
  }

  handleKeyDown(e) {
    if(e.keyCode == 13) {
      this.props.onChange(e.target.value);
      clearTimeout(this.timer);
    }
  }

  render() {
    return (
      <TextField
        {...this.props}
        value={this.state.value}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
      />
    )
  }
}

export default DelayChangeInput;
