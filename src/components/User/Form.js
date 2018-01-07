import React, { Component } from 'react';
import axios from 'axios';
import update from 'immutability-helper';
import { withRouter } from 'react-router-dom';
import url from 'url';

import TextField from 'material-ui/TextField'; 
import RaisedButton from 'material-ui/RaisedButton';

import styles from './Form.css.js';

class UserForm extends Component {
  constructor(props) {
    super(props);
    this.labels = props.labels || {};
    this.fields = this.fieldsFromLabels();
    this.state = { values: this.fields, errors: this.fields };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  fieldsFromLabels() {
    let fields = {};
    for(let field in this.labels) { fields[field] = "" }
    return fields;
  }

  handleInputChange(e) {
    const values = update(this.state.values,
      {[e.target.name]: { $set: e.target.value }});
    this.setState({ values: values });
  }

  handleSubmit(e) {
    e.preventDefault();
    axios.post(this.props.url, {user: this.state.values})
    .then(res => {
      this.setState({ values: this.fields, errors: this.fields });
      if(this.props.onSuccess) this.props.onSuccess(res);
      if(res.headers) this.handleRedirect(res.headers.location);
    })
    .catch(error => {
      if(error.response && (typeof error.response.data === 'object')) {
        this.setErrorMessages(error.response.data);
      }
      if(this.props.onFailure) this.props.onFailure(error);
    });
  }

  handleRedirect(toURL) {
    const redirectTo = url.parse(toURL || '');
    this.props.history.push(redirectTo.pathname);
  }

  setErrorMessages(errors) {
    let newErrors = {};
    for(let field in this.state.errors) {
      newErrors[field] = errors[field] ? errors[field] : "";
    }
    this.setState({errors: newErrors});
  }

  formFields() {
    return Object.keys(this.labels).map(field => (
      <TextField
        name={field}
        key={field}
        floatingLabelText={this.labels[field]}
        value={this.state.values[field]}
        onChange={this.handleInputChange}
        errorText={this.state.errors[field]} />
    ));
  }

  render() {
    return (
      <div style={styles.UserForm}>
        <form style={styles.Form}
            url={this.props.url}
            method={this.props.method || 'POST'}
            onSubmit={this.handleSubmit} >
          <div style={styles.Fields}>
            {this.formFields()}
          </div>
          <div style={styles.Actions}>
            <RaisedButton
              label={this.props.button}
              type="submit" />
          </div>
        </form>
      </div>
    )
  }
}

export default withRouter(UserForm);
