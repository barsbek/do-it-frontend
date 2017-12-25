import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = (props) => {
  // add component prop if needed
  return <Route path={props.path} render={() => {
    if(props.isAuthenticated) return props.children;
    if(props.loading)         return null;
                             return <Redirect to="/login" />;
  }}/>
}

export default PrivateRoute;
