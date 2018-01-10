import React from 'react';
import UserForm from './Form';

const UserRegister = props => (
  <UserForm
    labels={{
      name: "Full name",
      email: "Email",
      password: "Password",
      password_confirmation: "Password confirmation"
    }}
    button="Register"
    url="/api/register"
    {...props} />
);

export default UserRegister;
