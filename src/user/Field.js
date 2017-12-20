import React, { Component } from 'react';

const Field = props => (
  <div className="form-field">
    <input className="form-input"
      name={props.name}
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange} />
    {props.error &&
      <div className="form-input-error" htmlFor="name">
        {props.error}
      </div>
    }
  </div>
);

export default Field;
