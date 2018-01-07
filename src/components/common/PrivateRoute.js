import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';

import CircularProgress from 'material-ui/CircularProgress';

import withNotifiers from '../hocs/withNotifiers';

class PrivateRoute extends Component {
  constructor(props) {
    super(props);
    this.state = { user: null, loading: true }

    this.handleLogout = this.handleLogout.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentWillMount() {
    axios.get('/api/current_user')
    .then(res => {
      this.setState({ user: res.data, loading: false })
    })
    .catch(err => {
      this.setState({ loading: false });
      if(this.props.notifiers) this.props.notifiers.error(err);
    })
  }

  handleLogout() {
    this.setState({ user: null });
  }

  handleUpdate(user) {
    this.setState({ user });
  }

  render() {
    const { component: Component, ...rest } = this.props;
    const { user, loading } = this.state;

    return (
      <Route {...rest} render={props => {
        if(loading) return <CircularProgress />;
        if(user) return <Component {...props}
          user={user}
          onLogout={this.handleLogout}
          onUserUpdate={this.handleUpdate}
        />

        return <Redirect to={{
          pathname: '/login',
          state: { from: this.props.location }
        }} />
      }}/>
    )
  }
}

export default withNotifiers(PrivateRoute);
