import React from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import classNames from 'classnames';

import styles from './DragHandle.css';

const DragHandle = SortableHandle(props => {
  const className = classNames({
    [styles.disabled]: props.disabled,
    [props.className]: !!props.className
  });

  return (
    <span className={className}>
      {props.children}
    </span>
  );
});

export default DragHandle;
