import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';

import Task from '../Task';

const SortableTasks = SortableContainer((props) =>
  <div style={{ overflowY: 'auto', overflowX: 'hidden' }}>
    {props.items.map((item, index) => (
      <Task
        key={item.id}
        index={index}
        item={item}
        moved={item.moved}
        handlers={props.handlers}
        notifiers={props.notifiers}
      />
    ))}
  </div>
)

export default SortableTasks;
