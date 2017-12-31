import React, { Component } from 'react';
import axios from 'axios';

function withCrud(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);

      this.create = this.create.bind(this);
      this.update = this.update.bind(this);
      // this.read = this.read.bind(this);
      this.delete = this.delete.bind(this);
    }

    create(data) {
      axios.post(this.props.pathname, data)
      .then(res => {
        this.props.onCreate(res.data);
      })
      .catch(err => alert(err));
    }

    update(data) {
      const { pathname, name } = this.props;
      const { id }= this.props[name];
  
      axios.put(`${pathname}/${id}`, data)
      .then(res => {
        this.props.onUpdate(res.data);
      })
      .catch(err => alert(err));
    }

    // read(id) {
    //   const { pathname } = this.props;

    //   axios.get(`${pathname}/${id}`, data)
    //   .then(res => {
    //     this.props.onRead(res.data);
    //   })
    //   .catch(err => alert(err));
    // }
  
    delete(id) {
      if(id === "new")
        return this.props.onDelete({[this.props.name]: { id }});
  
      axios.delete(`${this.props.pathname}/${id}`)
      .then(res => {
        this.props.onDelete(res.data);
      })
      .catch(err => alert(err));
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          create={this.create}
          update={this.update}
          delete={this.delete}
        />
      )
    }
  }
}

export default withCrud;
