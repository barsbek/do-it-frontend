import React, { Component } from 'react';
import axios from 'axios';
import update from 'immutability-helper';

import Field from './Field';

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
      this.props.changeNotice("Couldn't create user");
      
      if(error.response && error.response.data) {
        this.setErrorMessages(error.response.data);
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

  render() {

    const formFields = Object.keys(this.labels).map(name => (
      <Field name={name}
        key={name}
        placeholder={this.labels[name]}
        value={this.state.values[name]}
        onChange={this.handleInputChange}
        error={this.state.errors[name]} />
    ));

    return (
      <form className="register-form"
          url={this.url}
          method={this.props.method || 'POST'}
          onSubmit={this.handleSubmit} >
        {formFields}
        <div className="register-form-actions">
          <input type="submit" value="Register" />
        </div>
      </form>
    )
  }
}

export default Register;
