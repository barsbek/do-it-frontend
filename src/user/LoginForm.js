import React from 'react';

import Form from './Form';

const LoginForm = props => (
  <Form
    labels={{ email: "Email *", password: "Password *" }}
    button="Authenticate"
    url="/api/login"
    onSuccess={props.onSuccess}
    changeNotice={props.changeNotice} />
)

export default LoginForm;
