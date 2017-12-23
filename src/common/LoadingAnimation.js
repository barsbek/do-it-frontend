import React from 'react';

import CircularProgress from 'material-ui/CircularProgress';

import './LoadingAnimation.css';

const LoadingAnimation = props => (
  props.loading &&
  <div class="loading-animation">
    <CircularProgress />
  </div>
)

export default LoadingAnimation;
