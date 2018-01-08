import React from 'react';
import MediaQuery from 'react-responsive';

import CircularProgress from 'material-ui/CircularProgress';

import NewListButton from '../List/AddButton';
import SortableLists from './SortableLists';

import withItems     from '../hocs/withItems';

const Collection = props => [
  (props.loading ? 
    <CircularProgress key="collection-loading" /> :
    <MediaQuery key="collection-lists" maxWidth={400}>
      {matches =>
        <SortableLists
          {...props}
          axis={ matches ? 'y' : 'xy' }
          onSortEnd={ props.handlers.onSortEnd }
        />
      }
    </MediaQuery>
  ),
  <NewListButton
    key="collection-new-list"
    onClick={() => props.handlers.newItem({ title: '' })}
  />
]

export default withItems({
  pathname: "/api/collections",
  storageName: "collection",
  itemsName: "lists"
})(Collection);
