import React from 'react';
import Form from './Form';

const Register = props => (
  <Form
    labels={{
      name: "Full name",
      email: "Email",
      password: "Password",
      password_confirmation: "Password confirmation"
    }}
    button="Register"
    url="/api/users"
    changeNotice={props.changeNotice} />
);

export default Register;
