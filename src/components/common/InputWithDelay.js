import React, { Component } from 'react';

import TextField from 'material-ui/TextField';

class InputWithDelay extends Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value }
    this.delay = this.props.delay || 600;

    this.handleChange = this.handleChange.bind(this);
    this.focusInput = this.focusInput.bind(this);
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

  focusInput(input) {
    if(this.props.focus && input) input.focus(); 
  }

  render() {
    const { onChangeStop, focus, ...rest } = this.props;
    return (
      <TextField
        style={{ width: '100%' }}
        {...rest}
        ref={this.focusInput}
        value={this.state.value}
        onChange={this.handleChange}
      />
    )
  }
}

export default InputWithDelay;
