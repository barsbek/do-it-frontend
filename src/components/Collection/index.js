import React, { Component } from 'react';

import CircularProgress from 'material-ui/CircularProgress';

import NewListButton from '../List/AddButton';
import withCrud      from '../hocs/withCrud';
import withItems     from '../hocs/withItems';
import SortableLists from './SortableLists';

const Collection = props => [
  (props.loading ? 
    <CircularProgress /> :
    <SortableLists {...props} onSortEnd={props.handlers.onSortEnd} />
  ),
  <NewListButton
    onClick={() => props.handlers.newItem({ title: '' })}
  />
]

export default withItems({
  pathname: "/api/collections",
  storageName: "collection",
  itemsName: "lists"
})(Collection);
