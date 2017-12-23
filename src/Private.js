import React from 'react';
import { Redirect } from 'react-router-dom';

const Private = (props) => {
  const inLoginPage = window.location.pathname === "/login";
  if(props.isAuthenticated) {
    return props.children;
  }
  if(!inLoginPage && !props.loading){
    return <Redirect to="/login" />;
  }
  return null;
}

export default Private;
