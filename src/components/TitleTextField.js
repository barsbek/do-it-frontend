import React, { Component } from 'react';

import TextField from 'material-ui/TextField';

class TitleTextField extends Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value }

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
      () => this.props.onChangeFinish(value),
    600);
  }

  handleKeyDown(e) {
    if(e.keyCode == 13) {
      this.props.onChangeFinish(e.target.value);
      clearTimeout(this.timer);
    }
  }

  render() {
    return (
      <TextField
        underlineStyle={{ borderColor: 'transparent'}}
        fullWidth={true}
        value={this.state.value}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        onFocus={this.props.onFocus}
      />
    )
  }
}

export default TitleTextField;
