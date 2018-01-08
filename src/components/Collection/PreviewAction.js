import React from 'react';

import IconButton       from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import ArrowForward     from 'material-ui/svg-icons/navigation/arrow-forward';
import ContentClear     from 'material-ui/svg-icons/content/clear';

import { isNew } from '../../modules/helpers';

const styles = {
  Button: {
    width: 40,
    padding: 6,
    paddingLeft: 0,
    zIndex: 2,
  }
}

const PreviewAction = (props) => {
  if(props.loading) return (
    <IconButton style={styles.Button}>
      <CircularProgress size={20} thickness={2} />
    </IconButton>
  )
  else if(props.removable) return (
    <IconButton style={styles.Button}
      onClick={props.onDelete}>
      <ContentClear />
    </IconButton>
  )
  else return (
    <IconButton style={styles.Button}
      disabled={isNew( props.id )}
      onClick={props.onFollow}>
      <ArrowForward />
    </IconButton>
  )
}

export default PreviewAction;
