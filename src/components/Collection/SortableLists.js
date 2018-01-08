import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';

import List from '../List';

import styles from './SortableLists.css';

const SortableLists = SortableContainer(props => (
  <div className={styles.Lists}>
    { props.items.map((item, index) => (
      <List
        key={item.id}
        index={index}
        withID={item.id}
        // moved should be passed via item
        moved={item.moved}
        item={{...item, collection_id: props.withID}}
        handlers={props.handlers}
        notifiers={props.notifiers}
      />
    )) }
  </div>
));

export default SortableLists;
