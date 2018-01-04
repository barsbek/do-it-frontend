import React, { Component } from 'react';
import axios from 'axios';

export default function withCrud(options) {

  return function Wrapper(WrappedComponent) {
  
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
        console.log(this.props.notifiers);
        axios.post(options.pathname, data)
        .then(res => {
          this.props.onCreate(res.data);
        })
        .catch(err => {
          if(this.props.notifiers) this.props.notifiers.error(err);
        });
      }

      update(data) {
        const { id }= this.props.item;
    
        axios.put(`${options.pathname}/${id}`, data)
        .then(res => {
          this.props.onUpdate(res.data);
        })
        .catch(err => {
          if(this.props.notifiers) this.props.notifiers.error(err);
        });
      }

      // read(id) {
      //   const { pathname } = this.props;

      //   axios.get(`${pathname}/${id}`, data)
      //   .then(res => {
      //     this.props.onRead(res.data);
      //   })
      //   .catch(err => alert(err));
      // }

      delete(item) {
        if(item.id === "new")
          return this.props.onDelete({ item });
        
        axios.delete(`${options.pathname}/${item.id}`)
        .then(res => {
          const item = res.data[options.name];
          const { last_update }= res.data;
          this.props.onDelete({ item, last_update });
        })
        .catch(err => {
          if(this.props.notifiers) this.props.notifiers.error(err);
        });
      }

      change(data) {
        const item = { ...this.props.item, ...data };
        if(item.id === "new") this.create(item);
        else this.update(item);
      }
    
      render() {
        const actions = {
          create: this.create,
          update: this.update,
          delete: this.delete,
          change: this.change,
        }

        return (
          <WrappedComponent
            {...this.props}
            crud={actions}
          />
        )
      }
    }
  }
}
