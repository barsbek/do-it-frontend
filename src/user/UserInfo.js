import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import CardHeader from 'material-ui/Card/CardHeader';

const UserInfo = (props) => (
  <CardHeader
    title={props.user.name}
    subtitle={props.user.email}>
  </CardHeader>
)

export default UserInfo;
