import React, { Component } from 'react';

import IconButton       from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import ArrowForward     from 'material-ui/svg-icons/navigation/arrow-forward';
import ContentClear     from 'material-ui/svg-icons/content/clear';

import { isNew } from '../../modules/helpers';

const PreviewAction = (props) => {
  const style = { zIndex: 2 };
  if(props.loading) return (
    <IconButton>
      <CircularProgress size={20} thickness={2} />
    </IconButton>
  )
  else if(props.removable) return (
    <IconButton
      onClick={props.onDelete}
      style={style}>
      <ContentClear />
    </IconButton>
  )
  else return (
    <IconButton
      disabled={isNew( props.id )}
      onClick={props.onFollow}
      style={style}>
      <ArrowForward />
    </IconButton>
  )
}

export default PreviewAction;
