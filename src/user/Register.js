import React, { Component } from 'react';
import axios from 'axios';
import update from 'immutability-helper';

import TextField from 'material-ui/TextField'; 
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

import './Register.css';

class Register extends Component {
  constructor(props) {
    super(props);
    this.url = props.url || "users";

    this.labels = {
      name: "Full name",
      email: "Email",
      password: "Password",
      password_confirmation: "Password confirmation"
    }
    this.fields = { name: '', email: '', password: '', password_confirmation: '' };
    this.state = {
      values: this.fields,
      errors: this.fields
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(e) {
    const values = update(this.state.values,
        {[e.target.name]: {$set: e.target.value}});
    this.setState({ values: values });
  }

  handleSubmit(e) {
    e.preventDefault();
    axios.post(this.url, {user: this.state.values})
    .then(res => {
      this.setState( {values: this.fields, errors: this.fields} );
      this.props.changeNotice("created User");
    })
    .catch(error => {
      if(error.response && error.response.data) {
        this.setErrorMessages(error.response.data);
      } else {
        this.props.changeNotice("Couldn't create user");
      }
    });
  }

  setErrorMessages(errors) {
    let newErrors = {};
    Object.keys(this.state.errors).map(name => {
      newErrors[name] = errors[name] ? errors[name] : "";
    });
    this.setState({errors: newErrors});
  }

  formFields() {
    return Object.keys(this.labels).map(name => (
      <TextField
        name={name}
        key={name}
        floatingLabelText={this.labels[name]}
        value={this.state.values[name]}
        onChange={this.handleInputChange}
        errorText={this.state.errors[name]} />
    ));
  }

  render() {
    return (
      <form className="register-form"
          url={this.url}
          method={this.props.method || 'POST'}
          onSubmit={this.handleSubmit} >
        <div className="register-form-fields">
          {this.formFields()}
        </div>
        <div className="register-form-actions">
          <RaisedButton
            label="Register"
            type="submit" />
        </div>
      </form>
    )
  }
}

export default Register;
