import React, { Component } from 'react';
import Register from './user/Register';

class App extends Component {
  constructor() {
    super();
    this.state = {
      notice: ''
    };

    this.onNoticeChange = this.onNoticeChange.bind(this);
  }

  onNoticeChange(notice) {
    this.setState({
      notice: notice
    })
  }

  render() {
    return (
      <div>
        <div className="notice">
          {this.state.notice}
        </div>
        <Register changeNotice={this.onNoticeChange}/>
      </div>
    );
  }
}

export default App;
