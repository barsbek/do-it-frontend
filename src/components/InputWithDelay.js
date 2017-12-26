import React, { Component } from 'react';

import TextField from 'material-ui/TextField';

class InputWithDelay extends Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value }
    this.delay = this.props.delay || 600;

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.timer = null;
  }

  handleChange(e) {
    const value = e.target.value;
    clearTimeout(this.timer);
    this.setState({ value })
    this.timer = setTimeout(
      () => this.props.onChangeStop(value),
    this.delay);
  }

  render() {
    const { onChangeStop, ...rest } = this.props;
    return (
      <TextField
        {...rest}
        value={this.state.value}
        onChange={this.handleChange}
      />
    )
  }
}

export default InputWithDelay;