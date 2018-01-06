import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';

import CollectionPreview from './Preview';

const SortablePreviews = SortableContainer(props => (
  <div>    
    {props.items.map((c, index) => (
      <CollectionPreview
        index={index}
        key={c.id}
        item={c}
        moved={c.moved}
        removable={props.removable}
        handlers={props.handlers}
        notifiers={props.notifiers}
      />
    ))}
  </div>
));

export default SortablePreviews;
