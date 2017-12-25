import React from 'react';

import Form from './Form';

const LoginForm = props => (
  <Form
    labels={{ email: "Email *", password: "Password *" }}
    button="Authenticate"
    url="/api/login"
    {...props} />
)

export default LoginForm;
