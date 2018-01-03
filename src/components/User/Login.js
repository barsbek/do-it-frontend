import React from 'react';

import UserForm from './Form';

const UserLogin = props => (
  <UserForm
    labels={{ email: "Email *", password: "Password *" }}
    button="Authenticate"
    url="/api/login"
    {...props} />
)

export default UserLogin;
