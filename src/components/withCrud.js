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
      this.change = this.change.bind(this);
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
      const { id }= this.props.item;
  
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
        return this.props.onDelete({item: { id }});
  
      axios.delete(`${this.props.pathname}/${id}`)
      .then(res => {
        const item = res.data[this.props.name];
        const { last_update }= res.data;
        this.props.onDelete({ item, last_update });
      })
      .catch(err => alert(err));
    }

    change(data) {
      const list = { ...this.props.item, ...data };
      if(list.id === "new") this.create(list);
      else this.update(list);
    }
  
    render() {
      return (
        <WrappedComponent
          {...this.props}
          create={this.create}
          update={this.update}
          delete={this.delete}
          change={this.change}
        />
      )
    }
  }
}

export default withCrud;
