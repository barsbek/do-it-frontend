import React from 'react';
import { Redirect } from 'react-router-dom';

const Private = (props) => {
  if(props.isAuthenticated) {
    return props.children;
  }

  const currentPath = window.location.pathname;
  const authPaths = ["/login", "/register"];
  const authFirst = authPaths.indexOf(currentPath) === -1;
  if(authFirst && !props.loading){
    return <Redirect to="/login" />;
  }
  return null;
}

export default Private;
