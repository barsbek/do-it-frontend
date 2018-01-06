import React, { Component } from 'react';
import axios from 'axios';

export default function withCrud(options) {

  return function Wrapper(WrappedComponent) {
  
    return class extends Component {
      constructor(props) {
        super(props);
        this.state = {
          loading: false
        }

        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        // this.read = this.read.bind(this);
        this.delete = this.delete.bind(this);
        this.change = this.change.bind(this);
      }

      create(data) {
        this.setState({ loading: true });
        axios.post(options.pathname, data)
        .then(res => {
          this.props.handlers.onCreate(res.data);
        })
        .catch(err => {
          if(this.props.notifiers) this.props.notifiers.error(err);
          this.setState({ loading: false });
        });
      }

      update(data) {
        const { id }= this.props.item;

        this.setState({ loading: true });
        axios.put(`${options.pathname}/${id}`, data)
        .then(res => {
          this.props.handlers.onUpdate(res.data);
          this.setState({ loading: false });
        })
        .catch(err => {
          if(this.props.notifiers) this.props.notifiers.error(err);
          this.setState({ loading: false });
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

        this.setState({ loading: true });
        axios.delete(`${options.pathname}/${item.id}`)
        .then(res => {
          const item = res.data[options.name];
          const { last_update }= res.data;
          this.props.handlers.onDelete({ item, last_update });
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
        const crud = {
          create: this.create,
          update: this.update,
          delete: this.delete,
          change: this.change,
          loading: this.state.loading,
        }
        
        return (
          <WrappedComponent
            {...this.props}
            crud={crud}
          />
        )
      }
    }
  }
}
